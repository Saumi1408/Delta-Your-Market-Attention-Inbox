package in.delta.watchlist;
import in.delta.checkpoint.CheckpointService;import in.delta.marketdata.ReliableMarketDataService;import org.springframework.stereotype.Service;import org.springframework.transaction.annotation.Transactional;import java.util.*;
@Service public class WatchlistService{
 private final UserRepository users;private final WatchlistRepository lists;private final WatchlistItemRepository items;private final CheckpointService checkpoints;private final ReliableMarketDataService provider;
 public WatchlistService(UserRepository u,WatchlistRepository l,WatchlistItemRepository i,CheckpointService c,ReliableMarketDataService p){users=u;lists=l;items=i;checkpoints=c;provider=p;}
 @Transactional public UserAccount login(String email){return users.findByEmailIgnoreCase(email).orElseGet(()->users.save(new UserAccount(email,"Saumiya")));}
 public List<WatchlistView> all(Long userId){return lists.findByUserIdOrderByCreatedAt(userId).stream().map(this::view).toList();}
 @Transactional public WatchlistView create(Long u,String name){return view(lists.save(new Watchlist(u,name)));}
 @Transactional public WatchlistView rename(Long id,Long u,String name){var w=owned(id,u);w.name=name;return view(lists.save(w));}
 @Transactional public void delete(Long id,Long u){owned(id,u);items.deleteByWatchlistId(id);lists.deleteById(id);}
 @Transactional public WatchlistView add(Long id,Long u,String instrument){owned(id,u);items.findByWatchlistIdAndInstrumentId(id,instrument).orElseGet(()->items.save(new WatchlistItem(id,instrument)));var q=provider.getQuote(instrument);if(checkpoints.get(u,instrument)==null)checkpoints.acknowledge(u,instrument,q.price(),q.volume());return view(owned(id,u));}
 @Transactional public WatchlistView remove(Long id,Long u,String instrument){owned(id,u);items.findByWatchlistIdAndInstrumentId(id,instrument).ifPresent(items::delete);return view(owned(id,u));}
 private Watchlist owned(Long id,Long user){var w=lists.findById(id).orElseThrow();if(!w.userId.equals(user))throw new NoSuchElementException();return w;}
 private WatchlistView view(Watchlist w){return new WatchlistView(w.id,w.name,items.findByWatchlistId(w.id).stream().map(x->x.instrumentId).toList());}
 public record WatchlistView(Long id,String name,List<String> instruments){}
}
