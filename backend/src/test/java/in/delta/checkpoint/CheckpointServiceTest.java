package in.delta.checkpoint;
import org.junit.jupiter.api.Test;import static org.assertj.core.api.Assertions.assertThat;
class CheckpointServiceTest{@Test void acknowledgingOneInstrumentDoesNotAcknowledgeAnother(){var s=new CheckpointService();s.acknowledge("u","TCS",100,10);assertThat(s.get("u","TCS")).isNotNull();assertThat(s.get("u","INFY")).isNull();}}
