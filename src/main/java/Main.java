import com.fastcgi.FCGIInterface;


import java.util.LinkedHashMap;
import java.util.Objects;

/*
- design
- sout's
 */

public class Main {

    public static void main(String[] args) {

        FCGIInterface fcgiInterface = new FCGIInterface();
        Answer answer = new Answer();
        Parser parser = new Parser();
        Validator validator = new Validator();

        while (fcgiInterface.FCGIaccept() >= 0) {

            String method = FCGIInterface.request.params.getProperty("REQUEST_METHOD");

            if (method.equals("GET")) {

                long startTime = System.nanoTime();
                String requestURL = FCGIInterface.request.params.getProperty("QUERY_STRING");
                if (!Objects.equals(requestURL, "")) {
                    LinkedHashMap<String, String> coordinates = parser.getValues(requestURL);
                    double x = 0;
                    double y= 0;
                    double r= 0;
                    boolean checkValid;
                    String verdict;
                    try {
                        x = Double.parseDouble(coordinates.get("x"));
                        y = Double.parseDouble(coordinates.get("y"));
                        r = Double.parseDouble(coordinates.get("r"));

                    } catch (NumberFormatException e) {
                        verdict = "NUMBER FORMAT EXCEPTION";
                    }
                    checkValid = validator.isValidCoordinates(x, y, r);
                    verdict = validator.isPointInside(x, y, r);
                    if (checkValid) {
                        System.out.println(answer.shaper(verdict, coordinates.get("x"), coordinates.get("y"), coordinates.get("r"), System.nanoTime() - startTime));
                    }else {
                        System.out.println(answer.shaper("NO VALID DATA", null, null, null, 0));
                    }
                } else {
                    System.out.println(answer.shaper("NO VALID REQUEST", null, null, null, 0));
                }
            } else {
                System.out.println(answer.shaper("NO SUCH METHODS", null, null, null, 0));
            }
        }

    }

}
