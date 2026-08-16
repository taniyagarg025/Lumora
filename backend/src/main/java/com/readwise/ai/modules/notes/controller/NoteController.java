package com.readwise.ai.modules.notes.controller;

import com.readwise.ai.common.dto.ApiResponse;
import com.readwise.ai.modules.notes.dto.CreateNoteRequest;
import com.readwise.ai.modules.notes.dto.NoteDto;
import com.readwise.ai.modules.notes.service.NoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NoteDto>>> getUserNotes(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) Long articleId
    ) {
        List<NoteDto> notes = noteService.getUserNotes(userDetails.getUsername(), articleId);
        return ResponseEntity.ok(ApiResponse.success(notes, "Notes retrieved successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<NoteDto>> createNote(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateNoteRequest request
    ) {
        NoteDto note = noteService.createNote(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(note, "Highlight and note saved successfully"));
    }

    @DeleteMapping("/{noteId}")
    public ResponseEntity<ApiResponse<Void>> deleteNote(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long noteId
    ) {
        noteService.deleteNote(userDetails.getUsername(), noteId);
        return ResponseEntity.ok(ApiResponse.success(null, "Note deleted successfully"));
    }
}
