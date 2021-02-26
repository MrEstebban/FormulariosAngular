import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidadoresService } from '../../services/validadores.service';

@Component({
  selector: 'app-reactive',
  templateUrl: './reactive.component.html',
  styleUrls: ['./reactive.component.css']
})
export class ReactiveComponent implements OnInit {

  forma: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private validador: ValidadoresService) {

    this.crearFormulario();
    this.cargarDataAlFormulario();
    this.crearListeners();

  }

  ngOnInit(): void {
  }

  get pasatiempos(){
    return this.forma.get('pasatiempos') as FormArray;
  }

  get nombreNoValido(){
    return this.forma.get('nombre').invalid && this.forma.get('nombre').touched;
  }

  get apellidoNoValido(){
    return this.forma.get('apellido').invalid && this.forma.get('apellido').touched;
  }

  get correoNoValido(){
    return this.forma.get('correo').invalid && this.forma.get('correo').touched;
  }

  get distritoNoValido(){
    return this.forma.get('direccion.distrito').invalid && this.forma.get('direccion.distrito').touched;
  }

  get ciudadNoValido(){
    return this.forma.get('direccion.ciudad').invalid && this.forma.get('direccion.distrito').touched;
  }

  get pass1NoValido(){
    return this.forma.get('password1').invalid && this.forma.get('password1').touched;
  }

  get pass2NoValido(){
    const pass1 =  this.forma.get('password1').value;
    const pass2 =  this.forma.get('password2').value;

    return !(pass1 === pass2);

    // return this.forma.get('password2').invalid && this.forma.get('password2').touched;
  }

  get usuarioNoValido(){
    return this.forma.get('usuario').invalid && this.forma.get('usuario').touched;
  }

  

  crearFormulario(){
    this.forma = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      apellido: ['', [Validators.required, this.validador.noPedraza]],
      correo: ['', [Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$'), Validators.required]],
      usuario: ['', , this.validador.existeUsuario],
      password1: ['', Validators.required],
      password2: ['', Validators.required],
      direccion: this.formBuilder.group({
        distrito: ['', Validators.required],
        ciudad: ['', Validators.required]
      }),
      pasatiempos: this.formBuilder.array([])
    },
    {
      validators: [this.validador.passwordsIguales('password1', 'password2')]
    });
  }

  crearListeners(){
    this.forma.valueChanges.subscribe(valor => {
      console.log(valor);
      
    });

    this.forma.statusChanges.subscribe(status => {
      console.log(status);
      
    })


    //Escuchar cambios de un campo en especifico
    this.forma.get('nombre').valueChanges.subscribe(value => {
      console.log(value);
      
    })
  }

  cargarDataAlFormulario(){

    //this.forma.setValue({
      this.forma.reset({  
      nombre: 'Esteban',
      apellido: 'Pedrazaa',
      correo: 'loquesea@gmail.com',
      direccion: {
        distrito: 'Boyacá',
        ciudad: 'Duitama'
      }
    });
  }

  guardar(){
    console.log(this.forma);

    if(this.forma.invalid){
      Object.values(this.forma.controls).forEach(control =>{

        if(control instanceof FormGroup){
          Object.values(control.controls).forEach(control =>{
            control.markAsTouched();
          });
        }else{
          control.markAsTouched();
        }
        
      });

      return;
    }

    // Poste de información

    //Reset del formulario
    this.forma.reset({
      nombre: 'Tu nombre'
    });
    
  }

  AgregarElementoTabla(){
    this.pasatiempos.push( this.formBuilder.control('', Validators.required));
  }

  BorrarElementoTabla(indice: number){
    this.pasatiempos.removeAt(indice);
  }

}
