import { Component, Output, EventEmitter, OnInit, Input } from "@angular/core";
import { FormGroup, AbstractControl, Validators, FormBuilder } from "@angular/forms";

import { NotificationService } from "src/app/core/notification/notification.service";
import { CustomValidators } from "src/app/validators/custom-validators";
import { ProjectService } from "../services/project.service";
import { SelectorModalService } from "src/app/modals/services/selector-modal.service";
import { ReferenceData } from "src/app/modals/models/reference-data.model";


@Component({
    selector: "add-project",
    templateUrl: "./add-project.component.html"
})

export class AddProjectComponent implements OnInit {
    @Input() referenceDatas: ReferenceData[];
    @Output() reloadProject = new EventEmitter();

    projectForm: FormGroup;
    formSubmitted = false;

    constructor(
      private fb: FormBuilder,
      private projectService: ProjectService,
      private selectorModalService: SelectorModalService,
      private notificationService: NotificationService) {
      this.projectForm = this.fb.group({
        name: ["", [Validators.required, CustomValidators.whiteSpace]],
        setDate: [],
        startDate: [""],
        endDate: [""],
        priority: ["", [Validators.required, CustomValidators.priorityRange]],
        userId: ["", [Validators.required]],
        manager: [""]
      });
    }

    get nameControl(): AbstractControl {
      return this.projectForm.get("name") as AbstractControl;
    }

    get priorityControl(): AbstractControl {
      return this.projectForm.get("priority") as AbstractControl;
    }

    get setDateControl(): AbstractControl {
      return this.projectForm.get("setDate") as AbstractControl;
    }

    get startDateControl(): AbstractControl {
      return this.projectForm.get("startDate") as AbstractControl;
    }

    get endDateControl(): AbstractControl {
      return this.projectForm.get("endDate") as AbstractControl;
    }

    get userIdControl(): AbstractControl {
      return this.projectForm.get("userId") as AbstractControl;
    }

    get managerControl(): AbstractControl {
      return this.projectForm.get("manager") as AbstractControl;
    }

    ngOnInit(): void {
      this.priorityControl.setValue(0);
      this.registerDateValueChanges();
    }

    selectManager(): void {
      this.selectorModalService.openSelectorModal("Project", this.referenceDatas, (item) => this.onSelectedUser(item));
    }

    addProject(): void {
      this.formSubmitted = true;

      if (!this.projectForm.valid) {
        return;
      }

      this.projectService.post(this.projectForm.value).subscribe(() => {
          this.notificationService.success("Project added successfully");
          this.reloadProject.emit();
          this.formSubmitted = false;
          this.reset();
        },
        () => {
          this.notificationService.error("Project could not be added!.");
      });
    }

    reset(): void {
      this.projectForm.reset();
      this.priorityControl.patchValue(0);
    }

  private registerDateValueChanges(): void {
    this.startDateControl.disable();
    this.endDateControl.disable();

    this.setDateControl.valueChanges.subscribe(value => {
      if (value) {
        const startDate = new Date();
        this.startDateControl.enable();
        this.setStartDate(startDate);
        this.startDateControl.setValidators([Validators.required, CustomValidators.inValidDate]);

        this.endDateControl.enable();
        this.setEndDate(startDate);
        this.endDateControl.setValidators([Validators.required, CustomValidators.inValidDate]);
      } else {
        this.startDateControl.disable();
        this.startDateControl.patchValue(undefined);
        this.startDateControl.clearValidators();

        this.endDateControl.disable();
        this.endDateControl.patchValue(undefined);
        this.endDateControl.clearValidators();
      }
    });
  }

  private setStartDate(date: Date): void {
    const startDate = date ? this.getDate(date) : undefined;
    this.startDateControl.setValue(startDate);
  }

  private setEndDate(date: Date): void {
    if (date) {
      date.setDate(date.getDate() + 1);
      this.endDateControl.setValue(this.getDate(date));
    }
  }

  private getDate(date: Date): string {
    if (date) {
    const day = ("0" + date.getDate()).slice(-2);
    const  month = ("0" + (date.getMonth() + 1)).slice(-2);

    return date.getFullYear() + "-" + month + "-" + day;
    }
  }

  private onSelectedUser(referenceData: ReferenceData): void {
    this.userIdControl.setValue(referenceData.id);
    this.managerControl.setValue(referenceData.description);
  }
}
