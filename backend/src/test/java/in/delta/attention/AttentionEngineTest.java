package in.delta.attention;
import org.junit.jupiter.api.Test;import static org.assertj.core.api.Assertions.assertThat;
class AttentionEngineTest{final AttentionEngine e=new AttentionEngine();
 @Test void combinesExplainableSignals(){var r=e.score(new AttentionEngine.Input(-6.8,2.83,2.1,1.8,-.7,true));assertThat(r.classification()).isEqualTo("NEEDS_ATTENTION");assertThat(r.reasons()).extracting(AttentionEngine.Reason::type).contains("PRICE_SHOCK","VOLUME_ANOMALY","RELATIVE_MOVE");}
 @Test void boundariesAreResponsible(){assertThat(e.score(new AttentionEngine.Input(0,1,1,1,0,false)).classification()).isEqualTo("QUIET");assertThat(e.score(new AttentionEngine.Input(3,1,1,1,3,false)).attentionScore()).isEqualTo(35);}
}
