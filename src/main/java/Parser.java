import java.util.LinkedHashMap;

public class Parser {
    protected LinkedHashMap<String, String> getValues(String request) {
        String[] params = request.split("&");
        LinkedHashMap<String, String> values = new LinkedHashMap<>();
        for (String param : params) {
            String[] keyValue = param.split("=");
            values.put(keyValue[0], keyValue[1]);
        }
        return values;
    }
}
