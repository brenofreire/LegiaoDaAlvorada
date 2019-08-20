import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events, ModalController, ActionSheetController, AlertController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  public usuario_logado = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: ApiProvider,
    public toastCtrl: ToastController,
    public events: Events,
    public storage: Storage,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
  ) {

  }
  ionViewDidLoad() {

  }
  ionViewWillEnter() {
    this.storage.get('usuario-cadastro').then(usuario_cadastro => {
      if (usuario_cadastro) {
        let modal_obrigado = this.modalCtrl.create("ObrigadoCadastrarPage");
        modal_obrigado.present();
      } else {
        this.storage.get('usuario-logado').then(usuario_logado => {
          if (!usuario_logado) {
            let modal_user = this.modalCtrl.create("UserPage");
            modal_user.present();
            modal_user.onDidDismiss(usuario_logado => {
              if(usuario_logado) this.usuario_logado = usuario_logado;
            });
          } else {
            this.usuario_logado = usuario_logado['usuario'];
          }
        }).catch(() => { });
      }
    }).catch(() => { });
  }
  actionSheetOpcoes() {
    let actionSheet_Opcoes = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Nova Atividade',
          handler: () => {
            this.navCtrl.push("LegiaoNovaTarefaPage");
          }
        },
        {
          text: 'Solicitações de Cadastro',
          handler: () => {
            this.navCtrl.push("UserCadastrosPage");
          }
        },
      ]
    });
    actionSheet_Opcoes.present();
  }
  logout() {
    this.alertCtrl.create({
      title: 'Deseja realmente sair?',
      buttons: [
        'Não',
        {
          text: 'Sim',
          handler: () => {
            this.storage.set('usuario-logado', null);
            this.navCtrl.setRoot('UserPage');
          }
        }
      ]
    }).present();
  }
}
