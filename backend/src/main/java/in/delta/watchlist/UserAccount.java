package in.delta.watchlist;
import jakarta.persistence.*;import java.time.Instant;
@Entity @Table(name="users") public class UserAccount{
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;@Column(unique=true,nullable=false)public String email;public String name;public Instant createdAt=Instant.now();
 protected UserAccount(){} public UserAccount(String email,String name){this.email=email;this.name=name;}
}
