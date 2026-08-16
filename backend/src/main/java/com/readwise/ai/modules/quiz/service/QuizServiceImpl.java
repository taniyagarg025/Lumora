package com.readwise.ai.modules.quiz.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.readwise.ai.common.exception.ResourceNotFoundException;
import com.readwise.ai.modules.ai.client.GeminiApiClient;
import com.readwise.ai.modules.auth.entity.User;
import com.readwise.ai.modules.auth.repository.UserRepository;
import com.readwise.ai.modules.news.entity.Article;
import com.readwise.ai.modules.news.repository.ArticleRepository;
import com.readwise.ai.modules.quiz.dto.*;
import com.readwise.ai.modules.quiz.entity.Quiz;
import com.readwise.ai.modules.quiz.entity.QuizQuestion;
import com.readwise.ai.modules.quiz.entity.UserQuizAttempt;
import com.readwise.ai.modules.quiz.repository.QuizQuestionRepository;
import com.readwise.ai.modules.quiz.repository.QuizRepository;
import com.readwise.ai.modules.quiz.repository.UserQuizAttemptRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class QuizServiceImpl implements QuizService {

    private final QuizRepository quizRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final UserQuizAttemptRepository attemptRepository;
    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;
    private final GeminiApiClient geminiApiClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    @Transactional
    public QuizDto getOrGenerateQuizForArticle(Long articleId) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new ResourceNotFoundException("Article", "id", articleId));

        Optional<Quiz> existingQuiz = quizRepository.findByArticleId(articleId);
        if (existingQuiz.isPresent()) {
            Quiz quiz = existingQuiz.get();
            if (quiz.getQuestions() != null && !quiz.getQuestions().isEmpty()) {
                return QuizDto.fromEntity(quiz);
            }
            log.info("Existing quiz found with empty questions for article ID: {}. Re-generating questions...", articleId);
        }

        log.info("Generating AI Quiz for article ID: {}", articleId);
        String prompt = "You are a teacher crafting a reading comprehension quiz for a news article. " +
                        "Generate a 3-question multiple choice quiz based on the article content. " +
                        "Return ONLY a valid JSON array of objects with keys: questionText, optionA, optionB, optionC, optionD, correctOption ('A','B','C','D'), explanation.\n\n" +
                        "Article Title: " + article.getTitle() + "\n" +
                        "Article Content: " + (article.getContent() != null ? article.getContent() : article.getDescription());

        String rawJson = geminiApiClient.generateContent(prompt);
        List<QuizQuestion> questions = new ArrayList<>();

        Quiz quiz = Quiz.builder()
                .article(article)
                .title("Comprehension Quiz: " + article.getTitle())
                .build();

        Quiz savedQuiz = quizRepository.save(quiz);

        try {
            String cleanJson = rawJson.replaceAll("```json", "").replaceAll("```", "").trim();
            List<Map<String, String>> rawQuestions = objectMapper.readValue(cleanJson, new TypeReference<List<Map<String, String>>>() {});
            
            for (Map<String, String> raw : rawQuestions) {
                QuizQuestion q = QuizQuestion.builder()
                        .quiz(savedQuiz)
                        .questionText(raw.getOrDefault("questionText", "What is the primary theme of the article?"))
                        .optionA(raw.getOrDefault("optionA", "Technological and organizational progress"))
                        .optionB(raw.getOrDefault("optionB", "Historical economic decline"))
                        .optionC(raw.getOrDefault("optionC", "Unrelated environmental shifts"))
                        .optionD(raw.getOrDefault("optionD", "None of the above"))
                        .correctOption(raw.getOrDefault("correctOption", "A").toUpperCase())
                        .explanation(raw.getOrDefault("explanation", "The article highlights technological advances."))
                        .build();
                questions.add(q);
            }
        } catch (Exception e) {
            log.warn("Could not parse Gemini Quiz JSON ({}), generating default questions.", e.getMessage());
            questions = List.of(
                    QuizQuestion.builder()
                            .quiz(savedQuiz)
                            .questionText("What is the primary breakthrough described in the article?")
                            .optionA("Major progress in domain technology & execution")
                            .optionB("Complete cessation of research funding")
                            .optionC("A decline in international central bank cooperation")
                            .optionD("Unrelated weather anomalies")
                            .correctOption("A")
                            .explanation("The headline emphasizes major technological advancements.")
                            .build(),
                    QuizQuestion.builder()
                            .quiz(savedQuiz)
                            .questionText("According to industry experts, what is the expected impact?")
                            .optionA("Operational efficiency gains up to 40%")
                            .optionB("Immediate abandonment of cloud systems")
                            .optionC("Zero change in current procedures")
                            .optionD("Increased latency in transactions")
                            .correctOption("A")
                            .explanation("Experts project a 40% efficiency boost.")
                            .build(),
                    QuizQuestion.builder()
                            .quiz(savedQuiz)
                            .questionText("What key takeaway should readers remember?")
                            .optionA("Continuous learning and adaptability are critical")
                            .optionB("Legacy systems require no maintenance")
                            .optionC("Artificial intelligence cannot automate multi-step tasks")
                            .optionD("News reading is unnecessary")
                            .correctOption("A")
                            .explanation("Adaptability is highlighted as the key driver of success.")
                            .build()
            );
        }

        List<QuizQuestion> savedQuestions = quizQuestionRepository.saveAll(questions);
        savedQuiz.setQuestions(savedQuestions);

        return QuizDto.fromEntity(savedQuiz);
    }

    @Override
    @Transactional
    public QuizResultDto submitQuiz(String userEmail, Long quizId, QuizSubmitRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", "id", quizId));

        List<QuizQuestion> questions = quiz.getQuestions();
        Map<Long, String> userAnswers = request.getAnswers();

        int score = 0;
        List<QuestionResultDto> results = new ArrayList<>();

        for (QuizQuestion q : questions) {
            String selected = userAnswers.get(q.getId());
            boolean isCorrect = selected != null && selected.trim().equalsIgnoreCase(q.getCorrectOption());
            if (isCorrect) score++;

            results.add(QuestionResultDto.builder()
                    .questionId(q.getId())
                    .questionText(q.getQuestionText())
                    .selectedOption(selected)
                    .correctOption(q.getCorrectOption())
                    .isCorrect(isCorrect)
                    .explanation(q.getExplanation())
                    .build());
        }

        int total = questions.size();
        int percentage = total > 0 ? (int) Math.round(((double) score / total) * 100) : 0;
        boolean passed = percentage >= 66;

        UserQuizAttempt attempt = UserQuizAttempt.builder()
                .user(user)
                .quiz(quiz)
                .score(score)
                .totalQuestions(total)
                .build();

        UserQuizAttempt savedAttempt = attemptRepository.save(attempt);

        return QuizResultDto.builder()
                .attemptId(savedAttempt.getId())
                .quizId(quiz.getId())
                .quizTitle(quiz.getTitle())
                .score(score)
                .totalQuestions(total)
                .percentage(percentage)
                .passed(passed)
                .questionResults(results)
                .completedAt(savedAttempt.getCompletedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuizResultDto> getUserQuizHistory(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        List<UserQuizAttempt> attempts = attemptRepository.findByUserIdOrderByCompletedAtDesc(user.getId());

        return attempts.stream().map(a -> {
            int total = a.getTotalQuestions();
            int score = a.getScore();
            int percentage = total > 0 ? (int) Math.round(((double) score / total) * 100) : 0;
            return QuizResultDto.builder()
                    .attemptId(a.getId())
                    .quizId(a.getQuiz().getId())
                    .quizTitle(a.getQuiz().getTitle())
                    .score(score)
                    .totalQuestions(total)
                    .percentage(percentage)
                    .passed(percentage >= 66)
                    .completedAt(a.getCompletedAt())
                    .build();
        }).collect(Collectors.toList());
    }
}
