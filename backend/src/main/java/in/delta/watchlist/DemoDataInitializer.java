package in.delta.watchlist;
import org.springframework.boot.CommandLineRunner;import org.springframework.stereotype.Component;
@Component public class DemoDataInitializer implements CommandLineRunner{
 private final WatchlistService service;public DemoDataInitializer(WatchlistService s){service=s;}
 public void run(String...args){var u=service.login("demo@delta.app");if(service.all(u.id).isEmpty()){var w=service.create(u.id,"Core holdings");for(var s:new String[]{"TATAMOTORS","INFY"})service.add(w.id(),u.id,s);}}
}
