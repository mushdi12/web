import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class Validator {


    private List<Double> yValues = new ArrayList<>();

    {
        yValues.add(-2.0);
        yValues.add(2.0);
        yValues.add(-1.5);
        yValues.add(1.5);
        yValues.add(-1.0);
        yValues.add(1.0);
        yValues.add(-0.5);
        yValues.add(0.5);
        yValues.add(0.0);
    }

    public boolean isValidCoordinates(double x, double y, double r) {
        return (x >= -3 && x <= 5 && 1 <= r && r <= 5);
    }


    public String isPointInside(double x, double y, double r) {
        if (checkSquare(x, y, r) || checkCircle(x, y, r) || checkTriangle(x, y, 0, 0, 0, r / 2, r, 0)){
            return "got";
        } else {
            return "miss";
        }

    }

    private boolean checkSquare(double x, double y, double r) {
        return x >= -r && x <= 0 && -r <= y && y <= 0;
    }

    private boolean checkCircle(double x, double y, double r) {
        return x <= 0 && y >= 0 && x * x + y * y <= r * r;
    }

    private boolean checkTriangle(double px, double py, double ax, double ay, double bx, double by, double cx, double cy) { // через y =kx+b
        double A =  calculateArea(ax, ay, bx, by, cx, cy);
        double B =  calculateArea(px, py, ax, ay, bx, by);
        double C =  calculateArea(px, py, bx, by, cx, cy);
        double D =  calculateArea(px, py, cx, cy, ax, ay);
        return A == B+C+D;
    }


    private double calculateArea(double x1, double y1, double x2, double y2, double x3, double y3) {
        return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2);
    }

}
