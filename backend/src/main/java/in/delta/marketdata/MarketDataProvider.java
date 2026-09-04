package in.delta.marketdata;
import java.time.Instant;import java.util.List;import java.util.Optional;
public interface MarketDataProvider{
 Quote getQuote(String symbol); List<Quote> getHistoricalData(String symbol,Instant from,Instant to); List<Instrument> searchInstruments(String query);
 record Quote(String instrumentId,double price,long volume,Instant exchangeTimestamp,Instant receivedAt,String provider,QualityStatus qualityStatus){}
 record Instrument(String id,String symbol,String companyName,String sector,String benchmarkSymbol){}
 enum QualityStatus{LIVE,DELAYED,STALE,CONFLICTED,UNAVAILABLE}
}
