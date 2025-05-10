/*=====================================================================*/
/*                                                                     */
/* PROGRAMMA NAAM:	Beheert de userdata 	(userdata.h)	       */
/* AUTEUR:              Resourser                                      */
/* BESCHRIJVING:                                                       */
/*   Deze h-file bevat de header voor de class shipballdata            */
/*								       */
/*                                                                     */
/*								       */
/* INPUT PAR:              geen                                        */
/* OUPUT PAR:              geen                                        */
/* DATUM:                  2 februari 1997                             */
/*=====================================================================*/

#if !defined( _shipball_h_)
#define _shipball_h_

struct vectors {vector ship,ball;};
struct intvecs {intvec ship,ball;};

const int      aantalangles          = 32;
const int      shipexplosionsoorten  = 15;

class Shipballdata
{
 public:
   void initshipball(vector newshipposition, int newfuelamount);
   void updateshipballstatus();
   void updateshipballposition();
   void wipeoldshipball();
   void drawshipball();

   int           getshipdamage()       {return (shipdamage);}
   int           getballdamage()       {return (balldamage);}
   vector        getshipposition()     {return (positions.ship);}
   vector        getballposition()     {return (positions.ball);}
   vector        getshipballvelocity() {return (XYvelocity);}
   intvec        getshipcoor()         {return (coors.ship);}
   intvec        getballcoor()         {return (coors.ball);}
   int           getfuelamount()       {return (fuel);}
   shieldcapture getshieldcapture()    {return (shieldcontents);}
   int           getshipsurfacehits()  {return (shipsurfacehits);}
   int           getballsurfacehits()  {return (ballsurfacehits);}
   onoff         getconnection()       {return (connection);}
   int           gethyperspacestatus() {return (hyperspacestatus);}
   int           getanglenr()          {return (anglenr);}

 private:
   bouwsteen      shipdata[aantalangles+1];
   bouwsteen      explosiondata[shipexplosionsoorten];

   vectors 	  positions;
   intvecs        coors;

   vector  	  XYvelocity;
   float   	  Rvelocity;

   int    	  shipdamage;
   int    	  balldamage;
   int            shipsurfacehits;
   int            ballsurfacehits;
   onoff          connection;
   shieldcapture  shieldcontents;

   int            hyperspacestatus;
   unsigned int   angle, anglenr;
   int     	  fuel;

   void     updateshipstatus();
   void     updateballstatus();
   void     checkhyperspacestatus();
   void     shieldmanager();

   vector   forcevectorcreate(int shipanglenr);
   vector   shipballXYversnelling(vector Vthrustforce);
   float    shipballrotateversnelling(vector Vthrustforce);
   vector   shipXYversnelling(vector Vthrustforce);

   vectors  shipballrotatemove(float rotateversnelling);
   vectors  shipballXYmove(vector XYversnelling);
   vectors  shipXYmove(vector XYversnelling);
   vectors  add(vectors XYmove, vectors rotatedelta, vectors positions);
   intvecs  postocoor();

   intvec        oldshipdrawposition, oldballdrawposition;
   int           olddrawanglenr;
};

#endif  _shipball_h_