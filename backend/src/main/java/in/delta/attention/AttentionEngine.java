package in.delta.attention;
import org.springframework.stereotype.Service;import java.util.*;
@Service public class AttentionEngine{
 public AttentionResult score(Input x){
  double shock=Math.abs(x.returnSinceSeen())/Math.max(x.expectedMove(),.1);double volume=Math.max(x.volumeRatio()-1,0);double vol=Math.max(x.volatilityRatio()-1,0);double relative=Math.abs(x.returnSinceSeen()-x.benchmarkReturn());
  int p=(int)Math.round(Math.min(shock/3,1)*35),v=(int)Math.round(Math.min(volume/1.5,1)*20),a=(int)Math.round(Math.min(vol/1.5,1)*15),r=(int)Math.round(Math.min(relative/5,1)*15),b=x.rangeBreakout()?15:0,total=Math.min(100,p+v+a+r+b);
  var reasons=new ArrayList<Reason>();if(p>0)reasons.add(new Reason("PRICE_SHOCK",p,"Moved %.1f× more than its typical movement".formatted(shock)));if(v>0)reasons.add(new Reason("VOLUME_ANOMALY",v,"Trading volume is %.1f× its recent average".formatted(x.volumeRatio())));if(r>0)reasons.add(new Reason("RELATIVE_MOVE",r,"Moved %.1f%% relative to its benchmark".formatted(x.returnSinceSeen()-x.benchmarkReturn())));if(b>0)reasons.add(new Reason("RANGE_BREAKOUT",b,"Moved outside its recent trading range"));
  return new AttentionResult(total,total<30?"QUIET":total<60?"WORTH_WATCHING":"NEEDS_ATTENTION",List.copyOf(reasons));
 }
 public record Input(double returnSinceSeen,double expectedMove,double volumeRatio,double volatilityRatio,double benchmarkReturn,boolean rangeBreakout){}
 public record Reason(String type,int contribution,String message){}
 public record AttentionResult(int attentionScore,String classification,List<Reason> reasons){}
}
