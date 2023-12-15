package com.tasks.rest;

import com.fasterxml.jackson.databind.node.TextNode;
import com.tasks.business.TasksService;
import com.tasks.business.entities.*;
import com.tasks.business.exceptions.DuplicatedResourceException;
import com.tasks.business.exceptions.InvalidStateException;
import com.tasks.business.exceptions.InstanceNotFoundException;
import com.tasks.business.exceptions.PermissionException;
import com.tasks.rest.dto.CommentDto;
import com.tasks.rest.dto.TaskDto;
import java.net.URI;
import java.security.Principal;

import com.tasks.rest.json.ErrorDetailsResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api")
@Tag(name = "Tasks Management")
public class TaskController {

    @Autowired
    private TasksService tasksService;    

    @Operation(summary = "Get all tasks")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved the list of tasks",
            content = {@Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = Task.class)))})
    })
    @RequestMapping(value = "/tasks", method = RequestMethod.GET)
    public ResponseEntity<Iterable<Task>> doGetTasks(@RequestParam(value = "owner", required = false) String owner) {
        return ResponseEntity.ok(StringUtils.isNotBlank(owner) ? 
            tasksService.findByOwner(owner) : tasksService.findAll());
    }

    @Operation(summary = "Find task by id")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved the task",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = Task.class))}),
        @ApiResponse(responseCode = "404", description = "The task does not exist",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ErrorDetailsResponse.class))})
    })
    @RequestMapping(value = "/tasks/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> doGetTaskById(@PathVariable("id") Long id) throws InstanceNotFoundException {
        return ResponseEntity.ok(tasksService.findById(id));
    }

    @Operation(summary = "Create task", security = {@SecurityRequirement(name = "Bearer")})
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Successfully created the task",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = Task.class))}),
        @ApiResponse(responseCode = "403", description = "Not Allowed",
                content = {@Content(mediaType = "application/json",
                        schema = @Schema(implementation = ErrorDetailsResponse.class))}),
        @ApiResponse(responseCode = "404", description = "The task already exists",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ErrorDetailsResponse.class))})
    })
    @RequestMapping(value = "/tasks", method = RequestMethod.POST)
    public ResponseEntity<?> doCreateTask(Principal principal, @RequestBody TaskDto task)
            throws DuplicatedResourceException, InstanceNotFoundException, PermissionException {
        Task newTask = tasksService.create(principal.getName(), task.getName(), task.getDescription(),
                task.getType(), task.getOwner(), task.getProject());
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(newTask.getTaskId()).toUri();
        return ResponseEntity.created(location).body(newTask);
    }

    @Operation(summary = "Update task by id", security = {@SecurityRequirement(name = "Bearer")})
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully updated the task",
            content = {@Content(mediaType = "application/json",
                schema = @Schema(implementation = Task.class))}),
        @ApiResponse(responseCode = "403", description = "Not Allowed",
                content = {@Content(mediaType = "application/json",
                        schema = @Schema(implementation = ErrorDetailsResponse.class))}),
        @ApiResponse(responseCode = "404", description = "The task or project does not exist",
            content = {@Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorDetailsResponse.class))}),
        @ApiResponse(responseCode = "409", description = "The task already exists",
            content = {@Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorDetailsResponse.class))})
    })
    @RequestMapping(value = "/tasks/{id}", method = RequestMethod.PUT)
    public ResponseEntity<?> doUpdateTask(Principal principal, @PathVariable("id") Long id, @RequestBody TaskDto task)
            throws InstanceNotFoundException, InvalidStateException, DuplicatedResourceException, PermissionException {
        Task updatedTask = tasksService.update(principal.getName(), id, task.getName(), task.getDescription(),
            task.getType(), task.getOwner(), task.getProject());
        return ResponseEntity.ok(updatedTask);
    }

    @Operation(summary = "Remove task by id", security = {@SecurityRequirement(name = "Bearer")})
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Successfully removed the task"),
        @ApiResponse(responseCode = "403", description = "Not Allowed",
            content = {@Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorDetailsResponse.class))}),
        @ApiResponse(responseCode = "404", description = "The task does not exist",
            content = {@Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorDetailsResponse.class))})
    })
    @RequestMapping(value = "/tasks/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<?> doRemoveTaskById(Principal principal, @PathVariable("id") Long id) throws InstanceNotFoundException, PermissionException {
        tasksService.removeById(principal.getName(), id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Change task state by id", security = {@SecurityRequirement(name = "Bearer")})
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully changed the task state",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = Task.class))}),
        @ApiResponse(responseCode = "403", description = "Not Allowed",
            content = {@Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorDetailsResponse.class))}),
        @ApiResponse(responseCode = "404", description = "The task does not exist",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ErrorDetailsResponse.class))})
    })
    @RequestMapping(value = "/tasks/{id}/changeState", method = RequestMethod.POST)
    public ResponseEntity<?> doChangeTaskState(Principal principal, @PathVariable("id") Long id,
                                         @RequestBody(required = true) TextNode state)
            throws InstanceNotFoundException, PermissionException {
        Task task = tasksService.changeState(principal.getName(), id, TaskState.valueOf(state.asText()));
        return ResponseEntity.ok(task);
    }

    @Operation(summary = "Change task resolution by id", security = {@SecurityRequirement(name = "Bearer")})
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully changed the task resolution",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = Task.class))}),
        @ApiResponse(responseCode = "403", description = "Not Allowed",
            content = {@Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorDetailsResponse.class))}),
        @ApiResponse(responseCode = "404", description = "The task does not exist or is closed",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ErrorDetailsResponse.class))})
    })
    @RequestMapping(value = "/tasks/{id}/changeResolution", method = RequestMethod.POST)
    public ResponseEntity<?> doChangeTaskResolution(Principal principal, @PathVariable("id") Long id,
                                                    @RequestBody(required = true) TextNode resolution)
            throws InstanceNotFoundException, InvalidStateException, PermissionException {
        Task task = tasksService.changeResolution(principal.getName(), id, TaskResolution.valueOf(resolution.asText()));
        return ResponseEntity.ok(task);
    }

    @Operation(summary = "Change task progress by id", security = {@SecurityRequirement(name = "Bearer")})
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully changed the task progress",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = Task.class))}),
        @ApiResponse(responseCode = "403", description = "Not Allowed",
            content = {@Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorDetailsResponse.class))}),
        @ApiResponse(responseCode = "404", description = "The task does not exist, is closed or is not in progress",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ErrorDetailsResponse.class))})
    })
    @RequestMapping(value = "/tasks/{id}/changeProgress", method = RequestMethod.POST)
    public ResponseEntity<?> doChangeTaskProgress(Principal principal, @PathVariable("id") Long id,
                                                  @RequestBody(required = true) TextNode progress)
            throws InstanceNotFoundException, InvalidStateException, PermissionException {
        Task task = tasksService.changeProgress(principal.getName(), id, (byte) progress.asInt());
        return ResponseEntity.ok(task);
    }

    @Operation(summary = "Create a comment", security = {@SecurityRequirement(name = "Bearer")})
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Successfully changed the comment"),
        @ApiResponse(responseCode = "404", description = "The task does not exist or is closed",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ErrorDetailsResponse.class))})
    })
    @RequestMapping(value = "/comments", method = RequestMethod.POST)
    public ResponseEntity<?> doCreateTaskComment(Principal principal, @RequestBody CommentDto comment) 
        throws InstanceNotFoundException, InvalidStateException {
        Comment newComment = tasksService
                .addComment(comment.getTaskId(), principal.getName(), comment.getText());
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}").buildAndExpand(newComment.getCommentId()).toUri();
        return ResponseEntity.created(location).build();
    }

    @Operation(summary = "Find comment by id")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved the comment",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = Comment.class))}),
        @ApiResponse(responseCode = "404", description = "The comment does not exist",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ErrorDetailsResponse.class))})
    })
    @RequestMapping(value = "/comments/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> doGetCommentById(@PathVariable("id") Long id) throws InstanceNotFoundException {
        return ResponseEntity.ok(tasksService.findCommentById(id));
    }    
}
