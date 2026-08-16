package com.readwise.ai.modules.notes.service;

import com.readwise.ai.common.exception.BadRequestException;
import com.readwise.ai.common.exception.ResourceNotFoundException;
import com.readwise.ai.modules.auth.entity.User;
import com.readwise.ai.modules.auth.repository.UserRepository;
import com.readwise.ai.modules.news.entity.Article;
import com.readwise.ai.modules.news.repository.ArticleRepository;
import com.readwise.ai.modules.notes.dto.CreateNoteRequest;
import com.readwise.ai.modules.notes.dto.NoteDto;
import com.readwise.ai.modules.notes.entity.UserNote;
import com.readwise.ai.modules.notes.repository.NoteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NoteServiceImpl implements NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;
    private final ArticleRepository articleRepository;

    @Override
    @Transactional(readOnly = true)
    public List<NoteDto> getUserNotes(String userEmail, Long articleId) {
        User user = getUser(userEmail);
        List<UserNote> notes;

        if (articleId != null) {
            notes = noteRepository.findByUserIdAndArticleIdOrderByCreatedAtDesc(user.getId(), articleId);
        } else {
            notes = noteRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        }

        return notes.stream().map(NoteDto::fromEntity).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public NoteDto createNote(String userEmail, CreateNoteRequest request) {
        User user = getUser(userEmail);
        Article article = articleRepository.findById(request.getArticleId())
                .orElseThrow(() -> new ResourceNotFoundException("Article", "id", request.getArticleId()));

        UserNote note = UserNote.builder()
                .user(user)
                .article(article)
                .highlightedText(request.getHighlightedText().trim())
                .noteContent(request.getNoteContent())
                .colorTag(request.getColorTag() != null ? request.getColorTag() : "yellow")
                .build();

        UserNote saved = noteRepository.save(note);
        return NoteDto.fromEntity(saved);
    }

    @Override
    @Transactional
    public void deleteNote(String userEmail, Long noteId) {
        User user = getUser(userEmail);
        UserNote note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note", "id", noteId));

        if (!note.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized to delete this note");
        }

        noteRepository.delete(note);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }
}
