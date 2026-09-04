package in.delta.watchlist;import org.springframework.data.jpa.repository.JpaRepository;import java.util.*;
public interface WatchlistItemRepository extends JpaRepository<WatchlistItem,Long>{List<WatchlistItem> findByWatchlistId(Long id);Optional<WatchlistItem> findByWatchlistIdAndInstrumentId(Long w,String i);long deleteByWatchlistId(Long id);}
