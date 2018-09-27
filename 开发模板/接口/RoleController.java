package com.ikey.springbootmodule.controller;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.ikey.springbootcommon.util.ExceptionType;
import com.ikey.springbootcommon.util.JsonUtil;
import com.ikey.springbootmodule.entity.Role;
import com.ikey.springbootmodule.entity.RoleMenu;
import com.ikey.springbootmodule.exception.GlobalException;
import com.ikey.springbootmodule.service.RoleMenuService;
import com.ikey.springbootmodule.service.RoleService;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Auther: laughing
 * @Date: 2018-9-12 14:04
 * @Description:
 */
@RestController
@RequestMapping("/role")
public class RoleController {

    @Autowired
    private RoleService roleService;
    @Autowired
    private RoleMenuService roleMenuService;

    //@RequiresPermissions("sys:role:list")
    @GetMapping("list")
    public String list(){
        //获得角色分组信息
        Map<String, List<Role>> map = new HashMap();
        EntityWrapper ew = new EntityWrapper();
        ew.orderBy("sort",true);
        List<Role> roleGroups = roleService.selectList(ew);
        for (Role roleGroup : roleGroups) {
            List<Role> parent = map.get(roleGroup.getParentId());
            if (parent == null) {
                parent = new ArrayList();
            }
            parent.add(roleGroup);
            map.put(roleGroup.getParentId(), parent);
        }
        List<Role> retList = MakeRole(map, "0");
        return JsonUtil.getSuccJson(retList);
    }

    private List<Role> MakeRole(Map<String, List<Role>> map, String roleId) {
        List<Role> roles = new ArrayList();
        List<Role> roleList = map.get(roleId);
        if (roleList != null) {
            for (Role me : roleList) {
                me.setChildren(MakeRole(map, me.getRoleId()));
                roles.add(me);
            }
        }
        return roles;
    }

    /**
     * 增加角色
     * @param role
     * @return
     */
    @PostMapping("/add")
    public String add(@RequestBody Role role){
        boolean b = checkRoleNo(role.getRoleNo());
        if(b){
            throw new GlobalException(ExceptionType.E0003,"角色编号已存在");
        }
        boolean result = roleService.insert(role);
        if (!result){
            throw new GlobalException(ExceptionType.E0002);
        }
        return JsonUtil.getSuccJson(role);
    }

    /**
     * 修改
     * @param role
     * @return
     */
    @PostMapping("/update")
    public String update(@RequestBody Role role){
        Role oldRole = roleService.selectById(role.getRoleId());
        if(!role.getRoleNo().equals(oldRole.getRoleNo())){
            boolean b = checkRoleNo(role.getRoleNo());
            if(b){
                throw new GlobalException(ExceptionType.E0003,"角色编号已存在");
            }
        }
        boolean result = roleService.updateById(role);
        if (!result){
            throw new GlobalException(ExceptionType.E0003);
        }
        return JsonUtil.getSuccJson(role);
    }

    /**
     * 查询
     * @param roleId
     * @return
     */
    @GetMapping("/query")
    public String query(@RequestParam(required = true)String roleId){
        Role role = roleService.selectById(roleId);
        return JsonUtil.getSuccJson(role);
    }

    /**
     * 删除角色
     * @param roleId
     * @return
     */
    @GetMapping("delete")
    public String delete(@RequestParam(required=true) String roleId) {
        boolean result = roleService.deleteById(roleId);
        if(!result){
            throw new GlobalException(ExceptionType.E0004);
        }
        EntityWrapper ew = new EntityWrapper();
        ew.eq("ROLE_ID",roleId);
        roleMenuService.delete(ew);
        return JsonUtil.getSuccJson(null);
    }


    /**
     * 获取角色菜单关联
     * @param roleId
     * @return
     */
    @GetMapping("/getRoleMenu")
    public String getRoleMenu(@RequestParam(name="roleId")String roleId){
        EntityWrapper ew = new EntityWrapper();
        ew.eq("ROLE_ID",roleId);
        List<RoleMenu> roleMenuList = roleMenuService.selectList(ew);
        return JsonUtil.getSuccJson(roleMenuList);
    }


    /**
     * 修改角色菜单
     * @param roleMenus
     * @return
     */
    @PostMapping("/addRoleMenu")
    public String addRoleMenu(@RequestBody List<RoleMenu> roleMenus){
        if(!roleMenus.isEmpty()){
            String roleId = roleMenus.get(0).getRoleId();
            EntityWrapper ew = new EntityWrapper();
            ew.eq("ROLE_ID",roleId);
            roleMenuService.delete(ew);
            roleMenuService.insertBatch(roleMenus);
            return JsonUtil.getSuccJson(null);
        }
        return JsonUtil.getErrJson(ExceptionType.E0003);
    }



    /**
     * 校验角色编号是否存在
     * @param roleNo
     * @return
     */
    @GetMapping("/checkRoleNo")
    public String checkRoleNo(@RequestParam(name = "roleId",required = false)String roleId,
                              @RequestParam(name = "roleNo")String roleNo){
        //如果修改相同可以进行修改
        if(StringUtils.isNotBlank(roleId)){
            Role role = roleService.selectById(roleId);
            if(roleNo.equals(role.getRoleNo())){
                return JsonUtil.getSuccJson(true);
            }
        }
        return JsonUtil.getSuccJson(checkRoleNo(roleNo));
    }

    /**
     * 校验角色编号是否存在
     * @param roleNo
     * @return
     */
    private boolean checkRoleNo(String roleNo){
        EntityWrapper ew = new EntityWrapper();
        ew.eq("ROLE_NO",roleNo);
        List<Role> roleList = roleService.selectList(ew);
        if(roleList!=null && !roleList.isEmpty()){
            return true;
        }
        return false;
    }

}
