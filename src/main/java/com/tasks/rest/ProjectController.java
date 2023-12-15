package com.tasks.rest;

import com.tasks.business.ProjectService;
import com.tasks.business.TasksService;
import com.tasks.business.entities.Project;
import com.tasks.business.entities.Task;
import com.tasks.business.exceptions.DuplicatedResourceException;
import com.tasks.business.exceptions.InstanceNotFoundException;
import com.tasks.business.exceptions.PermissionException;
import com.tasks.rest.dto.ProjectDto;
import com.tasks.rest.json.ErrorDetailsResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.security.Principal;

@RestController
@RequestMapping("/api")
@Tag(name = "Projects Management")
public class ProjectController {
    
    @Autowired
    private ProjectService projectService;
    
    @Autowired
    private TasksService tasksService;
    
    @Operation(summary = "Get all projects")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved the list of projects",
            content = {@Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = Project.class)))})
    })
    @RequestMapping(value = "/projects", method = RequestMethod.GET)
    public ResponseEntity<Iterable<Project>> doGetProjects() {
        return ResponseEntity.ok( projectService.findAll());
    }
    
    @Operation(summary = "Find project by id")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved the project",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = Project.class))}),
        @ApiResponse(responseCode = "404", description = "The project does not exist",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ErrorDetailsResponse.class))})
    })
    @RequestMapping(value = "/projects/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> doGetProjectById(@PathVariable("id") Long id) throws InstanceNotFoundException {
        return ResponseEntity.ok(projectService.findById(id));
    }

    @Operation(summary = "Create project", security = {@SecurityRequirement(name = "Bearer")})
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Successfully created the project",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = Project.class))}),
        @ApiResponse(responseCode = "409", description = "The project already exists",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ErrorDetailsResponse.class))})
    })
    @RequestMapping(value = "/projects", method = RequestMethod.POST)
    public ResponseEntity<?> doCreateProject(Principal principal, @RequestBody ProjectDto project) 
            throws DuplicatedResourceException, InstanceNotFoundException {
        Project newProject = projectService.create(project.getName(), project.getDescription(),
                principal.getName());
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(newProject.getProjectId()).toUri();
        return ResponseEntity.created(location).body(newProject);
    } 
    
    @Operation(summary = "Update project by id", security = {@SecurityRequirement(name = "Bearer")})
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully updated the project",
            content = {@Content(mediaType = "application/json",
                schema = @Schema(implementation = Project.class))}),
        @ApiResponse(responseCode = "403", description = "Not Allowed",
                content = {@Content(mediaType = "application/json",
                        schema = @Schema(implementation = ErrorDetailsResponse.class))}),
        @ApiResponse(responseCode = "404", description = "The project does not exist",
            content = {@Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorDetailsResponse.class))}),
        @ApiResponse(responseCode = "409", description = "The project already exists",
            content = {@Content(mediaType = "application/json",
            schema = @Schema(implementation = ErrorDetailsResponse.class))})
    })
    @RequestMapping(value = "/projects/{id}", method = RequestMethod.PUT)
    public ResponseEntity<?> doUpdateProject(Principal principal, @PathVariable("id") Long id, @RequestBody ProjectDto project)
            throws InstanceNotFoundException, DuplicatedResourceException, PermissionException {
        Project updatedProject = projectService.update(principal.getName(), id, project.getName(), project.getDescription());
        return ResponseEntity.ok(updatedProject);
    }

    @Operation(summary = "Remove project by id", security = {@SecurityRequirement(name = "Bearer")})
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Successfully removed the project"),
        @ApiResponse(responseCode = "403", description = "Not Allowed",
            content = {@Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorDetailsResponse.class))}),
        @ApiResponse(responseCode = "404", description = "The project does not exist",
            content = {@Content(mediaType = "application/json",
                schema = @Schema(implementation = ErrorDetailsResponse.class))})
    })
    @RequestMapping(value = "/projects/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<?> doRemoveProjectById(Principal principal, @PathVariable("id") Long id)
            throws InstanceNotFoundException, PermissionException {
        projectService.removeById(principal.getName(), id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    @Operation(summary = "Get project tasks by project id")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved the list of project tasks",
            content = {@Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = Task.class)))}),
        @ApiResponse(responseCode = "404", description = "The project does not exist",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ErrorDetailsResponse.class))})
    })    
    @RequestMapping(value = "/projects/{id}/tasks", method = RequestMethod.GET)
    public ResponseEntity<?> doGetProjectTasksById(@PathVariable("id") Long id) throws InstanceNotFoundException {
        return ResponseEntity.ok(tasksService.findByProjectId(id));
    }
    
}
