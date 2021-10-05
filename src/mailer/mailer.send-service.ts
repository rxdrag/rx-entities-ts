import { Injectable } from '@nestjs/common';
import { Attachment, EntityAttachment } from 'src/entity-interface/Attachment';
import { MailBoxType } from 'src/entity-interface/MailBoxType';
import { EntityMailConfig, MailConfig } from 'src/entity-interface/MailConfig';
import {
  EntityMailIdentifier,
  MailIdentifier,
} from 'src/entity-interface/MailIdentifier';
import { StorageService } from 'src/storage/storage.service';
import { TypeOrmService } from 'src/typeorm/typeorm.service';
import { BUCKET_MAILS, FOLDER_ATTACHMENTS } from 'src/util/consts';
import { decypt } from 'src/util/cropt-js';
import { getExt } from 'src/util/get-ext';
import { CRYPTO_KEY } from './consts';
import { MailerClientsPool } from './mailer.clients-pool';
import { MailMessage } from './mailer.mail-message';
const MailComposer = require('nodemailer/lib/mail-composer');
const nodemailer = require('nodemailer');

@Injectable()
export class SendService {
  constructor(
    private readonly clientsPool: MailerClientsPool,
    protected readonly storageService: StorageService,
    protected readonly typeOrmService: TypeOrmService,
  ) {}

  async sendMessage(message: MailMessage) {
    const mailConfig = await this.typeOrmService
      .getRepository<MailConfig>(EntityMailConfig)
      .findOne(message.fromConfigId);
    if (!mailConfig?.smtp) {
      throw Error('Can not find mail stmp config by id');
    }
    //const mailFileName = await this.compileAndSaveMessage(message);
    const option = {
      host: mailConfig.smtp.host,
      port: mailConfig.smtp.port,
      secure: mailConfig.smtp.port?.trim() == '465' ? true : false, // true for 465, false for other ports
      //service: 'Hotmail',
      auth: {
        user: mailConfig.smtp.account,
        pass: decypt(mailConfig.smtp.password, CRYPTO_KEY),
      },
      secureConnection: false, // use SSL
      requiresAuth: mailConfig.smtp.isAuth,
      ignoreTLS: !mailConfig.smtp.isStartTLS || false,
      requireTLS: mailConfig.smtp.isStartTLS || false,
    };
    const transporter = nodemailer.createTransport(option);

    console.log('哈哈', option, JSON.stringify(message.to));

    try {
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: `"${mailConfig.sendName}" <${mailConfig.address}>`, // sender address
        to: message.to, // list of receivers
        subject: message.subject, // Subject line
        text: message.text, // plain text body
        html: message.text, // html body
      });

      console.log('Message sent: %s', info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    } catch (err) {
      console.error(err);
    }
  }

  /*async saveMailToDatabase(
    uidl: string,
    passedMail: any,
    mailBox: MailBoxType,
    size: number,
  ) {
    const attachments = [];
    if (!passedMail) {
      throw new Error('NO parsed mail is provided');
    }
    for (let i = 0; i < passedMail.attachments?.length; i++) {
      const attachementObj = passedMail.attachments[i];
      const path = `${
        this.mailAddress
      }/${FOLDER_ATTACHMENTS}/${uidl}-${i}.${getExt(attachementObj.filename)}`;
      if (attachementObj.related) {
        //可能不需要保存
        continue;
      }
      await this.storageService.putFileData(
        path,
        attachementObj.content,
        BUCKET_MAILS,
      );
      attachments.push(
        await this.typeOrmService
          .getRepository<Attachment>(EntityAttachment)
          .save({
            fileName: attachementObj.filename,
            mimeType: attachementObj.contentType,
            size: attachementObj.size,
            path: path,
          }),
      );
    }

    let fromOldCustomer = false;
    const fromAddress = passedMail.from?.value[0]?.address;

    const mail = await this.typeOrmService
      .getRepository<Mail>(EntityMail)
      .save({
        subject: passedMail.subject,
        from: passedMail.from,
        to: passedMail.to,
        cc: passedMail.cc,
        bcc: passedMail.bcc,
        date: passedMail.date,
        messageId: passedMail.messageId,
        inReplyTo: passedMail.inReplyTo,
        replyTo: passedMail.replyTo,
        references: passedMail.references,
        html: passedMail.html,
        text: passedMail.text,
        textAsHtml: passedMail.textAsHtml,
        priority: passedMail.priority,
        owner: { id: this.accountId },
        inMailBox: mailBox,
        fromAddress: fromAddress,
        attachments: attachments,
        fromOldCustomer: fromOldCustomer,
        size: size,
      });
    await this.typeOrmService
      .getRepository<MailIdentifier>(EntityMailIdentifier)
      .save({
        uidl: uidl,
        mailAddress: this.mailAddress,
        file: this.getMailFileName(uidl, mailBox),
        mail: mail,
        fromBox: mailBox,
      });
  }

  private getMailFileName(uidl: string, mailBox: MailBoxType) {
    return `${this.mailAddress}/${mailBox}/${uidl}.eml`;
  }

  private async compileAndSaveMessage(uidl: string, message: MailMessage) {
    const mail = new MailComposer(message);
    return new Promise<string>((resolve, reject) => {
      console.log('Initial');

      mail.compile().build(function (err, message) {
        if (err) {
          reject(err);
        }
        this.storageService.saveMailToStorage(uidl, message, MailBoxType.SENT);
        //process.stdout.write(message);
        resolve('');
      });
    });
  }*/
}