package in.delta.api;
import org.springframework.http.*;import org.springframework.web.bind.annotation.*;import java.time.Instant;import java.util.Map;
@RestControllerAdvice public class ApiExceptionHandler{@ExceptionHandler(Exception.class)ResponseEntity<?> handle(Exception e){return ResponseEntity.status(500).body(Map.of("timestamp",Instant.now(),"code","DELTA_ERROR","message","The request could not be completed safely."));}}
