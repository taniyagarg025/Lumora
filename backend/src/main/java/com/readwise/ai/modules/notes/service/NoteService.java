package com.readwise.ai.modules.notes.service;

import com.readwise.ai.modules.notes.dto.CreateNoteRequest;
import com.readwise.ai.modules.notes.dto.NoteDto;

import java.util.List;

public interface NoteService {
    List<NoteDto> getUserNotes(String userEmail, Long articleId);
    NoteDto createNote(String userEmail, CreateNoteRequest request);
    void deleteNote(String userEmail, Long noteId);
}
