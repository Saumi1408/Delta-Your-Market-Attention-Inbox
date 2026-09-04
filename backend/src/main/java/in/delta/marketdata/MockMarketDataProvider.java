package in.delta.marketdata;
import org.springframework.stereotype.Component;import java.time.Instant;import java.util.*;
@Component public class MockMarketDataProvider implements MarketDataProvider{
 private final Map<String,Quote> latest=new HashMap<>(); private volatile String scenario="STOCK_SPECIFIC_FALL";
 public MockMarketDataProvider(){setScenario(scenario);}
 public synchronized void setScenario(String value){scenario=value;var now=Instant.now();var q=value.equals("STALE_DATA")?QualityStatus.STALE:value.equals("CONFLICTED_DATA")?QualityStatus.CONFLICTED:QualityStatus.LIVE;accept(new Quote("TATAMOTORS",663.20,21_000_000,now.minusSeconds(q==QualityStatus.STALE?480:14),now,"mock",q));accept(new Quote("INFY",1481.40,9_400_000,now.minusSeconds(11),now,"mock",QualityStatus.LIVE));}
 public synchronized boolean accept(Quote quote){var old=latest.get(quote.instrumentId());if(old!=null&&!quote.exchangeTimestamp().isAfter(old.exchangeTimestamp()))return false;latest.put(quote.instrumentId(),quote);return true;}
 public Quote getQuote(String symbol){return Optional.ofNullable(latest.get(symbol)).orElseThrow();}
 public List<Quote> getHistoricalData(String s,Instant f,Instant t){return List.of(getQuote(s));}
 public List<Instrument> searchInstruments(String q){return List.of(new Instrument("TATAMOTORS","TATAMOTORS","Tata Motors","Automobiles","NIFTYAUTO"),new Instrument("INFY","INFY","Infosys","IT","NIFTYIT")).stream().filter(i->i.symbol().contains(q.toUpperCase())||i.companyName().toLowerCase().contains(q.toLowerCase())).toList();}
 public String scenario(){return scenario;}
}
