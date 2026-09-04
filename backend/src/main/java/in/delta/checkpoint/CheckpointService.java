package in.delta.checkpoint;
import org.springframework.stereotype.Service;import java.time.Instant;import java.util.concurrent.ConcurrentHashMap;
@Service public class CheckpointService{
 private final ConcurrentHashMap<String,Checkpoint> state=new ConcurrentHashMap<>();private String key(String user,String instrument){return user+":"+instrument;}
 public Checkpoint acknowledge(String user,String instrument,double price,long volume){var c=new Checkpoint(user,instrument,price,volume,Instant.now());state.put(key(user,instrument),c);return c;}
 public Checkpoint get(String user,String instrument){return state.get(key(user,instrument));}
 public record Checkpoint(String userId,String instrumentId,double price,long volume,Instant capturedAt){}
}
