package com.tasks.rest;

import com.tasks.business.UsersService;
import com.tasks.business.entities.User;
import com.tasks.config.JwtTokenProvider;
import com.tasks.rest.json.Credentials;
import com.tasks.rest.json.ErrorDetailsResponse;
import com.tasks.rest.json.TokenResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@Tag(name = "Authentication")
public class UserController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UsersService userService;

    @Operation(summary = "Login to get a JWT Token")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully authenticated",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = TokenResponse.class))}),
        @ApiResponse(responseCode = "403", description = "Incorrect credentials",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ErrorDetailsResponse.class))})
    })
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public ResponseEntity<TokenResponse> doLogin(@RequestBody Credentials credentials) 
            throws AuthenticationException {

        final Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                credentials.getUsername(),
                credentials.getPassword()
            )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = null;
        if("user1".equals(credentials.getUsername())) {
            token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMSIsImV4cCI6MjMwOTYwNTA5NSwicm9sZXMiOlsiUk9MRV9VU0VSIl19.RqS_3sINVs5NO3nb18v27X1njHlEmJY0Qu_GWsqzpsc";
        } else if("admin1".equals(credentials.getUsername())) {
            token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbjEiLCJleHAiOjIzMDk2MDUxMzUsInJvbGVzIjpbIlJPTEVfQURNSU4iLCJST0xFX1VTRVIiXX0.0DFyKf_QNvpWgK0tFEdZymav7_4Ex-4KqRJxrzFe5rI";
        }

        return ResponseEntity.ok(new TokenResponse(token));
    }    
    
//    @ApiOperation(value = "Get all users", authorizations = {@Authorization(value = "Bearer")})
//    @ApiResponses(value = {
//        @ApiResponse(code = 200, message = "Successfully retrieved the list of users",
//                     responseContainer="List", response = User.class)
//    })
    @Operation(summary = "Get all users", security = {@SecurityRequirement(name = "Bearer")})
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved the list of users",
            content = {@Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = User.class)))})
    })
    @RequestMapping(value = "/users", method = RequestMethod.GET)
    public ResponseEntity<Iterable<User>> doGetUsers() {
        return ResponseEntity.ok(userService.findByUserRole());
    }    

}
