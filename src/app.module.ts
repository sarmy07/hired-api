import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { ConfigModule } from '@nestjs/config';
import { validation } from './config/validation.schema';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { JobsModule } from './jobs/jobs.module';
import { ApplicationsModule } from './applications/applications.module';
import { SkillsModule } from './skills/skills.module';
import { CategoriesModule } from './categories/categories.module';
import { ProfilesModule } from './profiles/profiles.module';
import { EducationModule } from './education/education.module';
import { ExperienceModule } from './experience/experience.module';
import { ResumesModule } from './resumes/resumes.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MailModule } from './mail/mail.module';
import { UploadsModule } from './uploads/uploads.module';
import { SavedJobsModule } from './saved-jobs/saved-jobs.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { ReportsModule } from './reports/reports.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validation,
      load: [],
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    CompaniesModule,
    JobsModule,
    ApplicationsModule,
    SkillsModule,
    CategoriesModule,
    ProfilesModule,
    EducationModule,
    ExperienceModule,
    ResumesModule,
    NotificationsModule,
    MailModule,
    UploadsModule,
    SavedJobsModule,
    BookmarksModule,
    ReportsModule,
    AdminModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
