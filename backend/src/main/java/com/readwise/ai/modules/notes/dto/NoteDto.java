package com.readwise.ai.modules.notes.dto;

import com.readwise.ai.modules.notes.entity.UserNote;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoteDto {

    private Long id;
    private Long articleId;
    private String articleTitle;
    private String highlightedText;
    private String noteContent;
    private String colorTag;
    private LocalDateTime createdAt;

    public static NoteDto fromEntity(UserNote note) {
        return NoteDto.builder()
                .id(note.getId())
                .articleId(note.getArticle() != null ? note.getArticle().getId() : null)
                .articleTitle(note.getArticle() != null ? note.getArticle().getTitle() : null)
                .highlightedText(note.getHighlightedText())
                .noteContent(note.getNoteContent())
                .colorTag(note.getColorTag())
                .createdAt(note.getCreatedAt())
                .build();
    }
}
