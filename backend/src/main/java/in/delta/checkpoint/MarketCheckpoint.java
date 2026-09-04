package in.delta.checkpoint;
import jakarta.persistence.*;import java.time.Instant;
@Entity @Table(name="market_checkpoints",uniqueConstraints=@UniqueConstraint(columnNames={"userId","instrumentId"})) public class MarketCheckpoint{
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY)public Long id;@Column(nullable=false)public Long userId;@Column(nullable=false)public String instrumentId;public double price;public long volume;public Instant capturedAt;
 protected MarketCheckpoint(){}public MarketCheckpoint(Long u,String i,double p,long v,Instant at){userId=u;instrumentId=i;price=p;volume=v;capturedAt=at;}
 public void update(double p,long v,Instant at){price=p;volume=v;capturedAt=at;}
}
