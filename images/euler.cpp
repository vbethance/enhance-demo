#include <bits/stdc++.h>
using namespace std;

const int N = INFINITY; 

int main() {                           //INFINITY
    double Eulers_Number = 1.0;         //just
    double fact = 1.0;                   //defined
                                          //for
    for (int i = 1; i <= N; i++) {         //fun!
        fact *= i;
        Eulers_Number += 1.0 / fact;
    }

    cout << fixed << setprecision(10) << Eulers_Number << endl;
}