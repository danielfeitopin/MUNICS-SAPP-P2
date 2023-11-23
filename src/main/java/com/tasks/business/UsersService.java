package com.tasks.business;

import com.tasks.business.entities.User;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.tasks.business.repository.UsersRepository;

@Service(value = "userService")
public class UsersService implements UserDetailsService {

    @Autowired
    private UsersRepository userRepository;
    
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
        Optional<User> optUser = userRepository.findById(userName);
        if(!optUser.isPresent()) {
            throw new UsernameNotFoundException(MessageFormat.format("User {0} does not exist", userName));
        }
        User user = optUser.get();
        return new org.springframework.security.core.userdetails.User(user.getUsername(), 
                user.getPassword(), getRoles(user.getRoles()));
    }

    @Transactional(readOnly = true)
    public Iterable<User> findAll() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Iterable<User> findByUserRole() {
        return userRepository.findByUserRole();
    }
    
    private static List<SimpleGrantedAuthority> getRoles(String rolesAsString) {
        List<SimpleGrantedAuthority> roles = new ArrayList<>();
        if(rolesAsString != null && !rolesAsString.isEmpty()) {
            String[] arrayOfRoles = rolesAsString.split(",");
            for (String role : arrayOfRoles) {
                roles.add(new SimpleGrantedAuthority(role));
            }
        }
        return roles;
    }
    
}
