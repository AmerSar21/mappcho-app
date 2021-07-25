import java.io.*;

import java.util.*;
public class studNameScore {
	public static void main(String[]args) throws Exception{
		File file = new File ("src/studentGrades.txt");
		Scanner scan = new Scanner(file);
		int score=0; char grade=0; String name;
		if(score>=24) {
			grade='H';
		}else if(score>=25 && score<=49) {
			grade='G';
		}else if(score>=50 && score<=74) {
			grade='F';
		}else if(score>=75 && score<=99) {
			grade='E';
		}else if(score>=100 && score<=124){
            grade='D'
        }else if(score>=125 && score<=149){
            grade='C'
        }else if(score>=150 && score<=174){
            grade='B'
        }else if(score>=175 && score<=200){
            grade='A'
        }else  {
			grade='H';
		}
       try {
			score = scan.nextInt();	
			while (score!= 0) {
				System.out.println(score + " " + grade );
				score = scan.nextInt();
			}
		}catch (Exception ex) {}
	}

}