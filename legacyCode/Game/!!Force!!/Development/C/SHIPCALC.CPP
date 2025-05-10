/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:      Shipanglecal & positioncalc (poscalc.cpp)      */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   Deze routine test of het mathematische model van het schip        */
/*   en de ball goed is ontworpen                                      */
/*                                                                     */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                  2 februari 1997                             */
/*=====================================================================*/

//================================================================
void calculate_shipanglenr(void)
  {
	int shipanglenr = getanglenr();

	shipanglenr  = (shipanglenr + getrotate());
	
	if      (shipanglenr >= aantalangles) shipanglenr = 0;
	else if (shipanglenr < 0)             shipanglenr = aantalangles - 1;

	setanglenr(shipanglenr);

	gotoxy(2,3);
	printf("%d ",getanglenr());
  }

//================================================================
static Vector  thrustvectorcreate(int shipanglenr);
static Vector  XYversnellingcalc(Vector Vthrustforce);
static float   rotateversnellingcalc(Vectors positions, Vector Vthrustforce);
static Vectors deltarotatecalc(Vectors positions ,float rotateversnelling);
static Vectors XYdeltamovecalc(Vector XYversnelling);
static Vectors add(Vectors XYdelta,Vectors rotatedelta,Vectors positions);


void calculatepositions(void)
  {
	Vectors           positions;
	Vectors           XYdelta;
	Vectors           rotatedelta;
	Vector            Vthrustforce;
	Vector            XYversnelling;

	float             rotateversnelling;

	positions = getpositions();

	if (getthrust())
	  {
		Vthrustforce      = thrustvectorcreate(getanglenr());
		XYversnelling     = XYversnellingcalc(Vthrustforce);
		rotateversnelling = rotateversnellingcalc(positions,Vthrustforce);
	  }
	else { XYversnelling.X = 0; XYversnelling.Y = 0; rotateversnelling = 0; }

	gotoxy(2,2);
	printf("%f %f %f ",rotateversnelling,XYversnelling.X,XYversnelling.Y);

	XYdelta     = XYdeltamovecalc(XYversnelling);
	rotatedelta = deltarotatecalc(positions,rotateversnelling);

	gotoxy(2,1);
	printf("%f %f %f %f",positions.ship.X,positions.ship.Y,positions.ball.X,positions.ball.Y);
	setpositions (add(XYdelta,rotatedelta,positions));
  }

//----------------------------------------------------------------
Vector thrustvectorcreate(int shipanglenr)
  {
	Vector Vthrustforce;
	float  shipangle;          // tov de verticaal

	shipangle = ((float)shipanglenr / aantalangles) * P2I;

	Vthrustforce.X =  thrustforce * -sin(shipangle);
	Vthrustforce.Y =  thrustforce *  cos(shipangle);

	return(Vthrustforce);
  }


Vector XYversnellingcalc(Vector Vthrustforce)
  {
	Vector versnelling;

	versnelling.X = Vthrustforce.X / (2* mass);
	versnelling.Y = Vthrustforce.Y / (2* mass);

	return(versnelling);
  }


float rotateversnellingcalc(Vectors positions, Vector Vthrustforce)
  {
	float versnelling;
	float rotateforce;
	Vector factor;

	factor.X = (positions.ship.X - positions.ball.X) / stanglength; // sin
	factor.Y = (positions.ship.Y - positions.ball.Y) / stanglength; // cos

	rotateforce = Vthrustforce.X * factor.Y - Vthrustforce.Y * factor.X;

	versnelling = -rotateforce / (2* mass);

	return(versnelling);
  }


Vectors XYdeltamovecalc(Vector XYversnelling)
  {
	static Vector XYvelocity;

	Vectors deltaverplaatsing;

	XYvelocity.X += XYversnelling.X * halfcyclustime;
	XYvelocity.Y += (XYversnelling.Y - gravity) * halfcyclustime;

	deltaverplaatsing.ship.X = deltaverplaatsing.ball.X = XYvelocity.X * cyclustime;
	deltaverplaatsing.ship.Y = deltaverplaatsing.ball.Y = XYvelocity.Y * cyclustime;

	return(deltaverplaatsing);
  }


Vectors deltarotatecalc(Vectors positions ,float rotateversnelling)
  {
	static float Rvelocity;
	float        deltaphi;
	Vector       halfposition;
	Vectors      deltaverplaatsing;

	float		    calcstanglength;
	float			 errorlength;
	Vector	    Verror;

	halfposition.X = (positions.ship.X - positions.ball.X) / 2;
	halfposition.Y = (positions.ship.Y - positions.ball.Y) / 2;

	Rvelocity += rotateversnelling * halfcyclustime;

	deltaphi   = (2 * Rvelocity * cyclustime) / stanglength;

	/* deze regels zijn voor het wegwerken van de afrondingsfouten */
		calcstanglength = sqrt(halfposition.X * halfposition.X + halfposition.Y * halfposition.Y);
		errorlength = calcstanglength - (stanglength / 2);
		Verror.X    = errorlength * halfposition.X / calcstanglength;
		Verror.Y    = errorlength * halfposition.Y / calcstanglength;

	deltaverplaatsing.ship.X = halfposition.X * (cos(deltaphi) - 1) - halfposition.Y * sin(deltaphi) - Verror.X;
	deltaverplaatsing.ship.Y = halfposition.Y * (cos(deltaphi) - 1) + halfposition.X * sin(deltaphi) - Verror.Y;

	deltaverplaatsing.ball.X = - deltaverplaatsing.ship.X;
	deltaverplaatsing.ball.Y = - deltaverplaatsing.ship.Y;

	gotoxy(2,4);
	printf("%f",Rvelocity);

	return(deltaverplaatsing);
  }


Vectors add(Vectors XYdelta,Vectors rotatedelta,Vectors positions)
  {
	Vectors newposition;

	newposition.ship.X = positions.ship.X + XYdelta.ship.X + rotatedelta.ship.X;
	newposition.ship.Y = positions.ship.Y + XYdelta.ship.Y + rotatedelta.ship.Y;
	newposition.ball.X = positions.ball.X + XYdelta.ball.X + rotatedelta.ball.X;
	newposition.ball.Y = positions.ball.Y + XYdelta.ball.Y + rotatedelta.ball.Y;

	return(newposition);
  }