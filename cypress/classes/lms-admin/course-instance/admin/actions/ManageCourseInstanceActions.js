import Field from '../../../../constants/Field'
import { OrgConst } from '../../../../org-management/base-org-management/OrgStub'
import ManageCourseInstanceItc from '../intercepts/ManageCourseInstanceItc'
import ManageCourseInstanceQueries from '../queries/ManageCourseInstanceQueries'

class ManageCourseInstanceActions extends ManageCourseInstanceQueries {
  visitManageCourseInstanceByCourseId(courseId) {
    ManageCourseInstanceItc.itcFetchCourseInstances.set()
    cy.visit(OrgConst.FIRE_CLOUD_FULL_CATALOG_URL + super.getManageCourseInstanceUrl(courseId))
    ManageCourseInstanceItc.itcFetchCourseInstances.wait()
  }

  expandArchived() {
    cy.waitLoadingOverlayNotExist()
    cy.get('a[data-toggle="collapse"]')
      .as('toggle')
      .invoke('attr', 'aria-expanded')
      .then(($isExpanded) => {
        if (!$isExpanded) {
          cy.get('@toggle').click()
          cy.wait(1000)
        }
      })
  }

  #clickThreeDotOptionAndConfirm(subject, option, btnConfirm) {
    cy.wrap(subject).within(($instance) => {
      cy.wrap($instance).getThreeDots().click()
      cy.wrap($instance).clickDropdownName(option)
      cy.wrap($instance).swal2().swal2Confirm(btnConfirm).click()
    })
  }

  #archiveCourseInstance(subject) {
    cy.wrap(subject).within(($instance) => {
      ManageCourseInstanceItc.itcArchiveInstance.set()
      ManageCourseInstanceItc.itcFetchCourseInstances.set()
      this.#clickThreeDotOptionAndConfirm($instance, Field.ARCHIVE, Field.YES_ARCHIVE)
      ManageCourseInstanceItc.itcArchiveInstance.wait()
      ManageCourseInstanceItc.itcFetchCourseInstances.wait()
    })
  }

  #archiveCourseInstanceByTitle(title) {
    super
      .getActiveCourseInstanceByTitle(title)
      .first()
      .within(($instance) => {
        this.#archiveCourseInstance($instance)
      })
  }

  #unArchiveCourseInstance(subject) {
    cy.wrap(subject).within(($instance) => {
      ManageCourseInstanceItc.itcArchiveInstance.set()
      ManageCourseInstanceItc.itcFetchCourseInstances.set()
      this.#clickThreeDotOptionAndConfirm($instance, Field.UN_ARCHIVE, Field.YES_UN_ARCHIVE)
      ManageCourseInstanceItc.itcArchiveInstance.wait()
      ManageCourseInstanceItc.itcFetchCourseInstances.wait()
    })
  }

  #unArchiveCourseInstanceByTitle(title) {
    super
      .getArchivedCourseInstanceByTitle(title)
      .first()
      .within(($instance) => {
        this.#unArchiveCourseInstance($instance)
      })
  }

  #deleteArchivedInstance(subject) {
    cy.wrap(subject).within(($instance) => {
      ManageCourseInstanceItc.itcDeleteInstance.set()
      ManageCourseInstanceItc.itcFetchCourseInstances.set()
      this.#clickThreeDotOptionAndConfirm($instance, Field.DELETE, Field.YES_DELETE)
      ManageCourseInstanceItc.itcDeleteInstance.wait()
      ManageCourseInstanceItc.itcFetchCourseInstances.wait()
    })
  }

  archiveAllActiveCourseInstancesWithTitle(title) {
    super.getActiveCourseInstanceByTitle(title).then(($list) => {
      if ($list.length) {
        $list.each(() => {
          this.#archiveCourseInstanceByTitle(title)
        })
      }
    })
  }

  unArchiveAllArchivedCourseInstanceWithTitle(title) {
    this.expandArchived()
    super.getArchivedCourseInstanceByTitle(title).then(($instances) => {
      if ($instances.length) {
        $instances.each(() => {
          this.#unArchiveCourseInstanceByTitle(title)
        })
      }
    })
  }

  deleteAllArchivedCourseInstancesWithTitle(title) {
    this.expandArchived()
    super.getArchivedCourseInstanceByTitle(title).then(($list) => {
      if ($list.length) {
        $list.each(() => {
          super
            .getArchivedCourseInstanceByTitle(title)
            .first()
            .within(($instance) => {
              this.#deleteArchivedInstance($instance)
            })
        })
      }
    })
  }

  #clickCourseInstanceThreeDotItemByTitle(instanceTitle, threeDotItem) {
    super.getActiveCourseInstanceByTitle(instanceTitle).within(($instance) => {
      cy.wrap($instance).first().clickDropdownItem(threeDotItem)
    })
  }

  clickEditCourseInstanceThreeDotItemByTitle(instanceTitle) {
    this.#clickCourseInstanceThreeDotItemByTitle(instanceTitle, Field.EDIT)
  }

  archiveAndDeleteCourseInstance(instanceTitle) {
    this.archiveAllActiveCourseInstancesWithTitle(instanceTitle)
    this.deleteAllArchivedCourseInstancesWithTitle(instanceTitle)
  }

  clickButtonCreateNewInstance() {
    super.getButtonCreateNewInstance().click()
  }
}

export default ManageCourseInstanceActions
