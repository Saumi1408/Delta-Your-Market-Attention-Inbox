package in.delta.api;
import in.delta.attention.AttentionEngine;import in.delta.checkpoint.CheckpointService;import in.delta.marketdata.*;import jakarta.validation.constraints.NotBlank;import org.springframework.http.MediaType;import org.springframework.web.bind.annotation.*;import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;import java.util.*;
@RestController @RequestMapping("/api") @CrossOrigin(origins="${delta.cors-origin:http://localhost:3000}") public class DeltaController{
 private final MockMarketDataProvider provider;private final AttentionEngine engine;private final CheckpointService checkpoints;public DeltaController(MockMarketDataProvider p,AttentionEngine e,CheckpointService c){provider=p;engine=e;checkpoints=c;}
 @GetMapping("/instruments/search") Object search(@RequestParam String q){return provider.searchInstruments(q);}
 @GetMapping("/watchlists/{id}/attention") Object attention(@PathVariable String id){var q=provider.getQuote("TATAMOTORS");return Map.of("watchlistId",id,"quote",q,"attention",engine.score(new AttentionEngine.Input(-6.8,2.83,2.1,1.8,-.7,true)));}
 @PostMapping("/instruments/{id}/acknowledge") Object acknowledge(@PathVariable String id,@RequestBody AcknowledgeRequest r){return checkpoints.acknowledge("demo-user",id,r.price(),r.volume());}
 @PostMapping("/dev/scenarios/{scenario}") Object scenario(@PathVariable String scenario){provider.setScenario(scenario.toUpperCase(Locale.ROOT));return Map.of("scenario",provider.scenario());}
 @GetMapping("/system/health") Object health(){return Map.of("marketProvider","HEALTHY","database","HEALTHY","redis","OPTIONAL","scenario",provider.scenario());}
 @GetMapping(value="/stream/watchlist/{id}",produces=MediaType.TEXT_EVENT_STREAM_VALUE) SseEmitter stream(@PathVariable String id){var e=new SseEmitter(30_000L);try{e.send(SseEmitter.event().name("attention").data(attention(id)));e.complete();}catch(Exception x){e.completeWithError(x);}return e;}
 public record AcknowledgeRequest(double price,long volume){}
}
