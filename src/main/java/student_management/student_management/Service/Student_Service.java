package student_management.student_management.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import student_management.student_management.entity.Student_Entity;
import student_management.student_management.repository.Student_Repository;

@Service
public class Student_Service {
    
	@Autowired
	Student_Repository repo;
	
	public Student_Entity SaveStudent(Student_Entity entity) {
		return repo.save(entity);
		
	}
	public List<Student_Entity> getAllData(){
		return repo.findAll();
	}
	public Student_Entity getStudentById(Integer id) {
        return repo.findById(id).orElse(null);
    }
	 public Student_Entity updateStudent(Integer id, Student_Entity newData) {
	        Student_Entity old = repo.findById(id).orElse(null);

	        if (old != null) {
	            old.setName(newData.getName());
	            old.setEmail(newData.getEmail());
	            old.setBranch(newData.getBranch());
	            return repo.save(old);
	        }
	        return null;
	    }
	 public void deleteStudent(Integer id) {
	        repo.deleteById(id);
	    }
}
