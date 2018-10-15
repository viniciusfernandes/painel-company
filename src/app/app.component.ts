import { Component, OnInit } from '@angular/core';

import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  descricaoTecnica:string;
  andares:number[][];
  mensagem:string='';
  peso:string=null;
  indice:string=null;
  constructor(private http:HttpClient){
    
  }

  ngOnInit(){
    let config:any;
    this.http.get('http://localhost:8080/elevador/config').subscribe(resp=> {
    config = resp;
    this.descricaoTecnica = config.descricao;
    this.andares = [];
    let tot =config.andarMax -config.andarMin ;
    this.andares[0] = new Array<number>();
    for (let i = 0,j=0; i <= tot; i++) {
      if(i> 0 && i % 3 == 0){
        if(this.andares[j] ){
          this.andares[j].sort((n1,n2)=> n1 - n2);
        }
        j++;
        this.andares[j] = new Array<number>();
      } 
      this.andares[j].push(i+config.andarMin);
    }

    let last:number[]=null;
    
    for(let k=0;k<this.andares.length/2;k++){
     last = this.andares[this.andares.length-k-1];
     this.andares[this.andares.length-k-1] = this.andares[k];
     this.andares[k] = last;
    }

   });
  
  }

  movimentar(andar:number){
    let m:any ; 
    let peso:string;
    let indice:string; 
    if(this.indice === null || this.indice.trim().length <=0){
      indice ='-1';
    } else {
      indice = this.indice;
    }
    if(this.peso === null || this.peso.trim().length <=0){
      peso = '-1';
    } else {
      peso = this.peso;
    }
    this.http.get(`http://localhost:8080/elevador/movimentar/${indice}/${peso}/${andar}`).subscribe(
      resp=> {
        m = resp;
        this.mensagem = m.texto;
        this.indice=null;
        this.peso=null;
      },
      error=>{
        this.mensagem = `Alerta: ${error.error.texto}`;
        this.indice=null;
        this.peso=null;
      });
  }

}
