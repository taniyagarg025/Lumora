package com.readwise.ai.modules.vocabulary.service;

import com.readwise.ai.common.exception.BadRequestException;
import com.readwise.ai.common.exception.ResourceNotFoundException;
import com.readwise.ai.modules.auth.entity.User;
import com.readwise.ai.modules.auth.repository.UserRepository;
import com.readwise.ai.modules.news.entity.Article;
import com.readwise.ai.modules.news.repository.ArticleRepository;
import com.readwise.ai.modules.vocabulary.dto.CreateVocabRequest;
import com.readwise.ai.modules.vocabulary.dto.VocabularyDto;
import com.readwise.ai.modules.vocabulary.entity.UserVocabulary;
import com.readwise.ai.modules.vocabulary.repository.VocabularyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class VocabularyServiceImpl implements VocabularyService {

    private final VocabularyRepository vocabularyRepository;
    private final UserRepository userRepository;
    private final ArticleRepository articleRepository;

    @Override
    @Transactional(readOnly = true)
    public List<VocabularyDto> getUserVocabulary(String userEmail, Boolean isMastered) {
        User user = getUser(userEmail);
        List<UserVocabulary> list;

        if (isMastered != null) {
            list = vocabularyRepository.findByUserIdAndIsMasteredOrderByCreatedAtDesc(user.getId(), isMastered);
        } else {
            list = vocabularyRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        }

        return list.stream().map(VocabularyDto::fromEntity).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public VocabularyDto saveWord(String userEmail, CreateVocabRequest request) {
        User user = getUser(userEmail);

        if (vocabularyRepository.existsByUserIdAndWord(user.getId(), request.getWord().trim())) {
            throw new BadRequestException("Word '" + request.getWord() + "' is already in your Vocabulary Vault!");
        }

        Article article = null;
        if (request.getArticleId() != null) {
            article = articleRepository.findById(request.getArticleId()).orElse(null);
        }

        UserVocabulary vocabulary = UserVocabulary.builder()
                .user(user)
                .article(article)
                .word(request.getWord().trim())
                .phonetics(request.getPhonetics())
                .partOfSpeech(request.getPartOfSpeech())
                .definition(request.getDefinition())
                .contextSentence(request.getContextSentence())
                .isMastered(false)
                .build();

        UserVocabulary saved = vocabularyRepository.save(vocabulary);
        return VocabularyDto.fromEntity(saved);
    }

    @Override
    @Transactional
    public VocabularyDto toggleMastered(String userEmail, Long vocabId) {
        User user = getUser(userEmail);
        UserVocabulary vocab = vocabularyRepository.findById(vocabId)
                .orElseThrow(() -> new ResourceNotFoundException("Vocabulary word", "id", vocabId));

        if (!vocab.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized to modify this vocabulary item");
        }

        vocab.setIsMastered(!vocab.getIsMastered());
        UserVocabulary updated = vocabularyRepository.save(vocab);
        return VocabularyDto.fromEntity(updated);
    }

    @Override
    @Transactional
    public void deleteWord(String userEmail, Long vocabId) {
        User user = getUser(userEmail);
        UserVocabulary vocab = vocabularyRepository.findById(vocabId)
                .orElseThrow(() -> new ResourceNotFoundException("Vocabulary word", "id", vocabId));

        if (!vocab.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized to delete this vocabulary item");
        }

        vocabularyRepository.delete(vocab);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }
}
