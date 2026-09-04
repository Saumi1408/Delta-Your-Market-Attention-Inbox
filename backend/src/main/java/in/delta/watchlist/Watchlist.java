package in.delta.watchlist;
import jakarta.persistence.*;import java.time.Instant;
@Entity @Table(name="watchlists") public class Watchlist{
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY)public Long id;@Column(nullable=false)public Long userId;@Column(nullable=false)public String name;public Instant createdAt=Instant.now();
 protected Watchlist(){}public Watchlist(Long userId,String name){this.userId=userId;this.name=name;}
}
