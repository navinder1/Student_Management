package student_management.student_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import student_management.student_management.entity.Student_Entity;

public interface Student_Repository extends JpaRepository<Student_Entity, Integer>{

}
