package in.delta.marketdata;
import org.springframework.stereotype.Component;import java.time.Instant;import java.util.*;
@Component public class MockMarketDataProvider implements MarketDataProvider{
 private final Map<String,Quote> latest=new HashMap<>(); private volatile String scenario="STOCK_SPECIFIC_FALL";
 private final List<Instrument> instruments=List.of(new Instrument("TATAMOTORS","TATAMOTORS","Tata Motors","Automobiles","NIFTYAUTO"),new Instrument("INFY","INFY","Infosys","IT","NIFTYIT"),new Instrument("RELIANCE","RELIANCE","Reliance Industries","Energy","NIFTY50"),new Instrument("TCS","TCS","Tata Consultancy Services","IT","NIFTYIT"),new Instrument("HDFCBANK","HDFCBANK","HDFC Bank","Banking","NIFTYBANK"),new Instrument("SBIN","SBIN","State Bank of India","Banking","NIFTYBANK"));
 public MockMarketDataProvider(){setScenario(scenario);}
 public synchronized void setScenario(String value){scenario=value;var now=Instant.now();var q=value.equals("STALE_DATA")?QualityStatus.STALE:value.equals("CONFLICTED_DATA")?QualityStatus.CONFLICTED:QualityStatus.LIVE;latest.clear();accept(new Quote("TATAMOTORS",663.20,21_000_000,now.minusSeconds(q==QualityStatus.STALE?480:14),now,"mock",q));accept(new Quote("INFY",1481.40,9_400_000,now.minusSeconds(11),now,"mock",QualityStatus.LIVE));accept(new Quote("RELIANCE",2954.10,7_100_000,now.minusSeconds(9),now,"mock",QualityStatus.LIVE));accept(new Quote("TCS",3942.60,3_200_000,now.minusSeconds(18),now,"mock",QualityStatus.LIVE));accept(new Quote("HDFCBANK",1694.80,12_000_000,now.minusSeconds(900),now,"mock",QualityStatus.DELAYED));accept(new Quote("SBIN",812.30,14_000_000,now.minusSeconds(16),now,"mock",QualityStatus.LIVE));}
 public synchronized boolean accept(Quote quote){var old=latest.get(quote.instrumentId());if(old!=null&&!quote.exchangeTimestamp().isAfter(old.exchangeTimestamp()))return false;latest.put(quote.instrumentId(),quote);return true;}
 public Quote getQuote(String symbol){return Optional.ofNullable(latest.get(symbol)).orElseThrow();}
 public List<Quote> getHistoricalData(String s,Instant f,Instant t){return List.of(getQuote(s));}
 public List<Instrument> searchInstruments(String q){return instruments.stream().filter(i->q.isBlank()||i.symbol().contains(q.toUpperCase())||i.companyName().toLowerCase().contains(q.toLowerCase())).toList();}
 public String scenario(){return scenario;}
}
