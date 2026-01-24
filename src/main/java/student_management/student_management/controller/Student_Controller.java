package student_management.student_management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import student_management.student_management.Service.Student_Service;
import student_management.student_management.entity.Student_Entity;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/student")
public class Student_Controller {
	
	@Autowired
	Student_Service service;
	
	@PostMapping
	public Student_Entity addStudnet(@RequestBody Student_Entity entity) {
		return service.SaveStudent(entity);
		
	}
	@GetMapping
	public List<Student_Entity>getStudents(){
		return service.getAllData();
		
	}
	
	@GetMapping("/{id}")
    public Student_Entity getOne(@PathVariable Integer id) {
        return service.getStudentById(id);
    }

    @PutMapping("/{id}")
    public Student_Entity update(@PathVariable Integer id, @RequestBody Student_Entity student) {
        return service.updateStudent(id, student);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Integer id) {
        service.deleteStudent(id);
        return "Student Deleted Successfully!";
    }

}
