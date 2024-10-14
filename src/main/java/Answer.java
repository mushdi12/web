public class Answer {
    protected  String shaper(String verdict, String x, String y, String r, long workTime) {
        return """
                Content-Type: application/json; charset=utf-8
                                
                                
                                
                {"workTime":"%s","workTime":"%s","x":"%s","y":"%s","r":"%s","result":"%s"}
                """.formatted(workTime,workTime, x, y, r, verdict);
    }
}
