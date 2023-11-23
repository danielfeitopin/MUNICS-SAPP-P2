package com.tasks.business.repository;

import com.tasks.business.entities.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface UsersRepository extends CrudRepository<User, String>{

    @Query("SELECT u FROM User u WHERE u.roles = 'ROLE_USER'")
    public Iterable<User> findByUserRole();
}
