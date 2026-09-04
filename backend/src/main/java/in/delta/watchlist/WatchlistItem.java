package in.delta.watchlist;
import jakarta.persistence.*;import java.time.Instant;
@Entity @Table(name="watchlist_items",uniqueConstraints=@UniqueConstraint(columnNames={"watchlistId","instrumentId"})) public class WatchlistItem{
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY)public Long id;@Column(nullable=false)public Long watchlistId;@Column(nullable=false)public String instrumentId;public Instant addedAt=Instant.now();
 protected WatchlistItem(){}public WatchlistItem(Long watchlistId,String instrumentId){this.watchlistId=watchlistId;this.instrumentId=instrumentId;}
}
