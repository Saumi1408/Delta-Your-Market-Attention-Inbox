package in.delta.marketdata;
import org.junit.jupiter.api.Test;import java.time.Instant;import static org.assertj.core.api.Assertions.assertThat;
class MockMarketDataProviderTest{@Test void outOfOrderQuoteCannotOverwriteLatest(){var p=new MockMarketDataProvider();var latest=p.getQuote("TATAMOTORS");var old=new MarketDataProvider.Quote("TATAMOTORS",1,1,latest.exchangeTimestamp().minusSeconds(60),Instant.now(),"mock",MarketDataProvider.QualityStatus.LIVE);assertThat(p.accept(old)).isFalse();assertThat(p.getQuote("TATAMOTORS").price()).isEqualTo(latest.price());}}
