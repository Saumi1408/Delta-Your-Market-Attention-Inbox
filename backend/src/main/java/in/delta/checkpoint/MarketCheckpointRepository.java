package in.delta.checkpoint;import org.springframework.data.jpa.repository.JpaRepository;import java.util.Optional;
public interface MarketCheckpointRepository extends JpaRepository<MarketCheckpoint,Long>{Optional<MarketCheckpoint> findByUserIdAndInstrumentId(Long userId,String instrumentId);}
