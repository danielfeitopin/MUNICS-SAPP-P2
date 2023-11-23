package com.tasks.business.repository;

import com.tasks.business.entities.Comment;
import org.springframework.data.repository.CrudRepository;

public interface CommentsRepository extends CrudRepository<Comment, Long>{

}
