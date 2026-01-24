package student_management.student_management.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
@Entity
@Table(name="student11")
public class Student_Entity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer roln;
	private String name;
	private String email;
	private String branch;
	public Integer getRoln() {
		return roln;
	}
	public void setRoln(Integer roln) {
		this.roln = roln;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getBranch() {
		return branch;
	}
	public void setBranch(String branch) {
		this.branch = branch;
	}
	@Override
	public String toString() {
		return "Student_Entity [roln=" + roln + ", name=" + name + ", email=" + email + ", branch=" + branch + "]";
	}
	public Student_Entity(Integer roln, String name, String email, String branch) {
		super();
		this.roln = roln;
		this.name = name;
		this.email = email;
		this.branch = branch;
	}
	public Student_Entity() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	
	
	
}
