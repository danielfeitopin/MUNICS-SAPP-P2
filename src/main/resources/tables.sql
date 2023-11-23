

drop table comments;
drop table tasks;
drop table projects;
drop table users;

create table comments (
                      comment_id bigint generated by default as identity,
                      text varchar(255) not null,
                      timestamp bigint not null,
                      task_id bigint not null,
                      user_id varchar(255) not null,
                      primary key (comment_id)
);

create table projects (
                      project_id bigint generated by default as identity,
                      description varchar(255),
                      name varchar(255) not null,
                      tasks_count integer,
                      timestamp bigint not null,
                      admin_id varchar(255) not null,
                      primary key (project_id)
);

create table tasks (
                   task_id bigint generated by default as identity,
                   description varchar(255),
                   name varchar(255) not null,
                   progress smallint not null,
                   resolution varchar(255) not null check (resolution in ('NEW','IN_PROGRESS','COMPLETED')),
                   state varchar(255) not null check (state in ('OPEN','CLOSED')),
                   timestamp bigint not null,
                   type varchar(255) not null check (type in ('BUG','FEATURE')),
                   owner_id varchar(255) not null,
                   project_id bigint not null,
                   primary key (task_id)
);

create table users (
                   user_name varchar(255) not null,
                   password varchar(255) not null,
                   roles varchar(255) not null,
                   primary key (user_name)
);

alter table comments
    add constraint FKi7pp0331nbiwd2844kg78kfwb
        foreign key (task_id)
            references tasks;

alter table comments
    add constraint FK8omq0tc18jd43bu5tjh6jvraq
        foreign key (user_id)
            references users;

alter table projects
    add constraint FKelm9q9pv7mdta3i0vaus514qd
        foreign key (admin_id)
            references users;

alter table tasks
    add constraint FKh279lo9lqbhxqh68jq9sqs83s
        foreign key (owner_id)
            references users;

alter table tasks
    add constraint FKsfhn82y57i3k9uxww1s007acc
        foreign key (project_id)
            references projects;