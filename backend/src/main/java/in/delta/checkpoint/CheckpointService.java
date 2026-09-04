package in.delta.checkpoint;
import org.springframework.stereotype.Service;import org.springframework.transaction.annotation.Transactional;import java.time.Instant;
@Service public class CheckpointService{
 private final MarketCheckpointRepository repo;public CheckpointService(MarketCheckpointRepository repo){this.repo=repo;}
 @Transactional public MarketCheckpoint acknowledge(Long user,String instrument,double price,long volume){var c=repo.findByUserIdAndInstrumentId(user,instrument).orElseGet(()->new MarketCheckpoint(user,instrument,price,volume,Instant.now()));c.update(price,volume,Instant.now());return repo.save(c);}
 public MarketCheckpoint get(Long user,String instrument){return repo.findByUserIdAndInstrumentId(user,instrument).orElse(null);}
}
