import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, AlertController, ActionSheetController, ToastController } from 'ionic-angular';
import { ApiProvider } from '../../../../providers/api/api';
import { Storage } from '@ionic/storage';
import { ToolsProvider } from '../../../../providers/tools/tools';

@IonicPage()
@Component({
  selector: 'page-superadmin',
  templateUrl: 'superadmin.html',
})
export class SuperadminPage {
  public buscaValor = '';
  public usuario_logado;
  public usuarios;
  public page_options = {
    carregando: true,
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: ApiProvider,
    public banco: Storage,
    public modalCtrl: ModalController,
    public tools: ToolsProvider,
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
  ) { }

  ionViewDidLoad() {

  }
  async ionViewWillEnter() {
    this.usuario_logado = await this.tools.getUsuarioLogado();
  }
  ionViewDidEnter() {
    this.api.get('conta/get_usuarios_geral?capitulo=' + this.usuario_logado['capitulo'] + '&buscaValor=' + this.buscaValor).then(retorno => {
      this.usuarios = retorno;
      this.page_options.carregando = false;
    });
  }
  objectKeys(obj) {
    return Object.keys(obj);
  }
  opcoesUsuario(usuario, e) {
    e.stopPropagation();
    this.actionSheetCtrl.create({
      title: 'Opções de Superadmin',
      buttons: [
        {
          text: 'Mudar capitulo',
          icon: 'bowtie',
          handler: () => {
            this.alertCtrl.create({
              title: 'Insira o número do capítulo',
              inputs: [{
                type: 'text',
                placeholder: 'Número do Capítulo',
              }],
              buttons: [
                'Cancelar',
                {
                  text: 'OK',
                  handler: capitulo => {
                    if (!isNaN(capitulo[0]))
                      this.alertCtrl.create({
                        title: `Deseja realmente alterar o capítulo de  ${usuario.nome}?`,
                        buttons: ['Cancelar', {
                          text: 'Confirmar alteração',
                          handler: () => {
                            usuario['capitulo'] = capitulo[0];
                            this.modificarUsuario(usuario, 'Capitulo do usário alterado com sucesso!');
                          }
                        }]
                      }).present();
                    else {
                      this.toastCtrl.create({
                        message: 'O capítulo precisa ser um número.',
                        duration: 3000,
                      }).present();
                      return false;
                    }
                  }
                }
              ]
            }).present();
          }
        },
        {
          text: 'Mudar Privilégio',
          icon: 'lock',
          handler: () => {
            this.alertCtrl.create({
              inputs: [
                {
                  type: 'radio',
                  label: 'Usuario Comum',
                  value: 'Usuario Comum'
                },
                {
                  type: 'radio',
                  label: 'Diretoria',
                  value: 'Diretoria'
                },
                {
                  type: 'Admin',
                  label: 'Admin',
                  value: 'Admin'
                },
              ],
              buttons: [
                'Cancelar',
                {
                  text: 'OK',
                  handler: role => {
                    this.alertCtrl.create({
                      title: `Deseja realmente transformar ${usuario.nome} em ${role}`,
                      buttons: [
                        'Cancelar',
                        {
                          text: 'Confirmar alteração',
                          handler: () => {
                            let roles = {
                              'Usuario comum': 1,
                              'Diretoria': 5,
                              'Admin': 7,
                            }
                            usuario['role'] = roles[role];
                            this.modificarUsuario(usuario, 'Privilégio de usuário alterado com sucesso!');
                          }
                        }
                      ]
                    }).present();
                  }
                }
              ]
            }).present();
          },
        },
        {
          text: 'Excluir usuário',
          cssClass: 'red-alert',
          icon: 'trash',
          handler: () => {
            this.alertCtrl.create({
              title: `Deseja realmente excluir ${usuario.nome}`,
              subTitle: 'Essa ação não poderá ser desfeita',
              buttons: [
                'Cancelar',
                {
                  text: 'Excluir',
                  handler: () => {
                    usuario['status'] = 0;
                    this.modificarUsuario(usuario, 'Usuário excluído com sucesso!');
                  }
                }
              ]
            }).present();
          }
        }
      ]
    }).present();
  }
  modificarUsuario(usuario, message){
    this.api.post('conta/modificar_usuario', usuario).then(() => {
      this.toastCtrl.create({ message: message, duration: 3000, position: 'top',}).present();
    }).catch(() => {
      this.toastCtrl.create({ 
        message: 'Houve um erro ao alterar o capítulo do usuário! Tente novamente mais tarde...', 
        duration: 3000
      }).present();
    });
  }
}
