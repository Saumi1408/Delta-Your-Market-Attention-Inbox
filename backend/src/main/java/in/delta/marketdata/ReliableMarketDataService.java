package in.delta.marketdata;
import org.springframework.stereotype.Service;import java.time.Instant;import java.util.concurrent.*;import java.util.concurrent.ConcurrentHashMap;
@Service public class ReliableMarketDataService{
 private final MarketDataProvider provider;private final ConcurrentHashMap<String,MarketDataProvider.Quote> lastGood=new ConcurrentHashMap<>();
 public ReliableMarketDataService(MarketDataProvider provider){this.provider=provider;}
 public MarketDataProvider.Quote getQuote(String symbol){RuntimeException failure=null;for(int attempt=0;attempt<3;attempt++){try{var q=CompletableFuture.supplyAsync(()->provider.getQuote(symbol)).get(1500,TimeUnit.MILLISECONDS);if(q.qualityStatus()!=MarketDataProvider.QualityStatus.UNAVAILABLE)lastGood.put(symbol,q);return q;}catch(Exception e){failure=new RuntimeException(e);try{Thread.sleep(50L*(1L<<attempt));}catch(InterruptedException x){Thread.currentThread().interrupt();break;}}}var cached=lastGood.get(symbol);if(cached!=null)return new MarketDataProvider.Quote(cached.instrumentId(),cached.price(),cached.volume(),cached.exchangeTimestamp(),Instant.now(),cached.provider(),MarketDataProvider.QualityStatus.STALE);throw failure==null?new IllegalStateException("Market data unavailable"):failure;}
}
