#include	<stdio.h>
#include	<io.h>
#include	<FCNTL.H>
#include	<stdlib.h>
#include	<conio.h>
#include	<iostream.h>
#include	<dos.h>
#include	<math.h>

#include	"bouwgeg.h"

struct bouwsteen2
	 {
	  unsigned char	   blok[26][22];
	 };

struct bouwsteen
	 {
	  unsigned char	   blok[22][26];
	 };

FILE	     *fpsource,*fpdestination;

bouwsteen    newbuff;
bouwsteen2   oldbuff;

 main()
   {
    if ((fpsource = fopen("explosn.mix", "r")) == NULL)
      cout << "\n cannot open file";

    else if ((fpdestination = fopen("ball2.mix", "w")) == NULL)
      cout << "\n cannot open file";

    else
      {
       setmode(fileno(fpsource), O_BINARY); // de stream wordt nu als binair behandeld

       fseek(fpdestination, 0, SEEK_SET);
       fseek(fpsource, 0, SEEK_SET);

       for (int teller = 0; teller < 20; teller++)
	 {
	  cout << fread (oldbuff.blok, sizeof(oldbuff), 1, fpsource);

	  for (int hoogte = 0; hoogte < 22; hoogte++)
	    for (int lengte = 0; lengte < 26; lengte++)
	      newbuff.blok[hoogte][lengte] = oldbuff.blok[lengte][hoogte];

	  cout << fwrite(newbuff.blok, sizeof(newbuff), 1, fpdestination);
	 }
       fclose(fpsource);
       fclose(fpdestination);
      }
   }
